# Webpack 代码分块策略优化建议

## 当前配置问题分析

### 1. 正则表达式问题
- `muiComponent` 中的路径不正确（`@zack/components` 应该是 `@zack/ui`）
- `ethersSDK` 的正则表达式匹配不准确

### 2. 缺少关键库的拆分
- React Router 没有单独拆分（7.10.0 版本约 50KB gzipped）
- Jotai 状态管理库没有单独拆分
- @zack/* 私有包全部打包在一起，可以更细粒度拆分

### 3. vendors 太宽泛
- 所有未匹配的 node_modules 都进入 vendors，可能导致包过大

---

## 优化后的完整配置

```javascript
optimization: {
  runtimeChunk: {
    name: "runtime",
  },
  splitChunks: {
    chunks: "all",
    maxInitialRequests: 6,  // ✅ 增加到 6，因为我们拆分了更多组
    maxAsyncRequests: 10,   // ✅ 增加到 10，支持更多异步加载
    minRemainingSize: 20000,
    cacheGroups: {
      // 优先级 7：React 核心库（最稳定，变更频率最低）
      reactLibs: {
        name: "chunk-react-libs",
        test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
        chunks: "all",
        priority: 7,
        reuseExistingChunk: true,
        enforce: true, // ✅ 强制拆分，确保独立
      },

      // 优先级 6：Ethers SDK（体积大，变更频率低）
      ethersSDK: {
        name: "chunk-ethers-sdk",
        test: /[\\/]node_modules[\\/](ethers|@ethersproject[\\/])/,
        chunks: "all",
        priority: 6,
        reuseExistingChunk: true,
        enforce: true,
      },

      // 优先级 5：路由库（中等体积，变更频率中等）
      routerLibs: {
        name: "chunk-router",
        test: /[\\/]node_modules[\\/]react-router(-dom)?[\\/]/,
        chunks: "all",
        priority: 5,
        reuseExistingChunk: true,
      },

      // 优先级 4：状态管理库（Jotai）
      stateLibs: {
        name: "chunk-state",
        test: /[\\/]node_modules[\\/](jotai|jotai-immer|immer)[\\/]/,
        chunks: "all",
        priority: 4,
        reuseExistingChunk: true,
      },

      // 优先级 4：UI 组件库（@mui + @zack/ui）
      uiLibs: {
        name: "chunk-ui-libs",
        test: /[\\/]node_modules[\\/](@mui|@zack[\\/]ui)[\\/]/,
        chunks: "all",
        priority: 4,
        reuseExistingChunk: true,
      },

      // 优先级 3：@zack 私有工具库
      zackLibs: {
        name: "chunk-zack-libs",
        test: /[\\/]node_modules[\\/]@zack[\\/](libs|hooks)[\\/]/,
        chunks: "all",
        priority: 3,
        reuseExistingChunk: true,
      },

      // 优先级 2：其他第三方依赖
      vendors: {
        name: "chunk-vendors",
        test: /[\\/]node_modules[\\/]/,
        chunks: "all",
        priority: 2,
        reuseExistingChunk: true,
        // ✅ 限制 vendors 包的大小
        maxSize: 300000, // 300KB
      },

      // 优先级 1：业务代码公共部分
      commons: {
        name: "chunk-common",
        chunks: "all",
        minChunks: 2,
        priority: 1,
        reuseExistingChunk: true,
        // ✅ 业务代码也限制大小
        maxSize: 200000, // 200KB
      },
    },
    minSize: {
      javascript: 20000,  // 20KB
      style: 20000,
    },
    maxSize: {
      javascript: 300000, // ✅ 降低到 300KB（原来是 500KB）
      style: 50000,       // ✅ CSS 增加到 50KB（原来是 20KB）
    },
  },
},
```

---

## 进一步优化建议

### 1. 按路由懒加载（代码分割）

如果你的路由还没有使用 React.lazy，建议改造：

```typescript
// ❌ 不好：直接导入
import HomePage from '@pages/Home';
import AboutPage from '@pages/About';

// ✅ 好：懒加载
const HomePage = React.lazy(() => import('@pages/Home'));
const AboutPage = React.lazy(() => import('@pages/About'));

// 在路由配置中使用 Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</Suspense>
```

### 2. 使用 webpack-bundle-analyzer 分析

你已经安装了 `webpack-bundle-analyzer`，建议在构建时查看：

```javascript
// config/webpack.production.js 中添加
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: '../bundle-report.html',
  }),
]
```

### 3. 预加载关键资源

对于关键路由，可以使用 prefetch：

```typescript
// 预加载下一个可能访问的页面
const NextPage = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@pages/Next')
);
```

### 4. Tree Shaking 优化

确保在 package.json 中标记 sideEffects：

```json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

### 5. 动态导入优化

对于条件性使用的大型库，使用动态导入：

```typescript
// ❌ 不好：总是导入
import { someHeavyFunction } from 'heavy-library';

// ✅ 好：按需导入
const loadHeavyFunction = async () => {
  const { someHeavyFunction } = await import('heavy-library');
  return someHeavyFunction;
};
```

---

## 预期效果

### 优化前（假设）
```
chunk-react-libs.js      150KB
chunk-ethers-sdk.js      200KB
chunk-vendors.js         800KB  ⚠️ 太大
chunk-common.js          100KB
main.js                  300KB
```

### 优化后
```
chunk-react-libs.js      150KB  ✅ React 核心
chunk-ethers-sdk.js      200KB  ✅ Ethers SDK
chunk-router.js           50KB  ✅ 路由库
chunk-state.js            30KB  ✅ 状态管理
chunk-ui-libs.js         150KB  ✅ UI 库
chunk-zack-libs.js        80KB  ✅ 私有工具
chunk-vendors.js         200KB  ✅ 大幅减小
chunk-common.js           80KB  ✅ 业务公共代码
main.js                  100KB  ✅ 入口文件变小
```

---

## 缓存策略配合

配合你刚才配置的 Nginx 缓存策略：

```nginx
# JS 文件使用协商缓存（因为经常更新）
location ~* \.js$ {
    add_header Cache-Control "no-cache";
    etag on;
}

# 或者对于 chunk 文件使用强缓存（因为有 contenthash）
location ~* chunk-.*\.js$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 对于 main.js 使用协商缓存
location ~* main\..*\.js$ {
    add_header Cache-Control "no-cache";
    etag on;
}
```

---

## 验证步骤

1. **构建并分析**
```bash
npm run client:prod
# 查看生成的文件
ls -lh dist/scripts/
```

2. **使用 Bundle Analyzer**
```bash
# 打开 bundle-report.html 查看各个包的大小
```

3. **检查加载顺序**
- 打开浏览器 DevTools
- Network 面板查看资源加载顺序
- 确保 runtime → react-libs → 其他 chunk → main 的顺序

4. **性能测试**
```bash
# 使用 Lighthouse 测试
# 关注 First Contentful Paint 和 Time to Interactive
```

---

## 总结

| 优化项 | 优化前 | 优化后 | 收益 |
|--------|--------|--------|------|
| 正则表达式 | 不准确 | ✅ 精确匹配 | 避免误匹配 |
| Router 拆分 | ❌ 无 | ✅ 独立包 | 50KB 独立缓存 |
| State 拆分 | ❌ 无 | ✅ 独立包 | 30KB 独立缓存 |
| vendors 大小 | 可能 >500KB | ✅ <300KB | 首屏加载更快 |
| maxSize | 500KB | ✅ 300KB | 避免单包过大 |
| 优先级 | 基本合理 | ✅ 更细粒度 | 缓存命中率提升 |

**核心收益**：
- ✅ 更细粒度的缓存控制
- ✅ 首屏加载体积减小
- ✅ 更好的长期缓存策略
- ✅ 并行加载能力提升
