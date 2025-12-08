# My SPA - Modern React Web3 Application

一个现代化的React单页应用，集成Web3功能，使用最新的前端技术栈构建。

## 📋 目录

- [技术栈](#技术栈)
- [项目架构](#项目架构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [构建与部署](#构建与部署)
- [测试](#测试)
- [代码规范](#代码规范)
- [优化建议](#优化建议)

---

## 🛠 技术栈

### 核心框架
- **React** `19.2.0` - UI框架
- **TypeScript** - 类型安全
- **React Router DOM** `7.10.0` - 路由管理

### 构建工具
- **Webpack** `5.103.0` - 模块打包
- **SWC** `1.15.3` - 超快速编译器（替代Babel）
- **PostCSS** `8.5.6` - CSS处理
- **Webpack Dev Server** `5.2.2` - 开发服务器

### 样式方案
- **Tailwind CSS** `4.1.17` - 原子化CSS框架
- **CSS Modules** - 支持样式隔离
- **Mini CSS Extract Plugin** - CSS提取与优化

### 状态管理
- **Jotai** `2.15.2` - 原子化状态管理
- **Jotai-immer** `0.4.1` - 集成Immer的不可变更新
- **Immer** `11.0.1` - 不可变数据结构

### Web3集成
- **ethers.js** `6.16.0` - 以太坊交互库
- **TypeChain** `8.3.2` - 智能合约类型生成
  - `@typechain/ethers-v6` `0.5.1` - Ethers v6适配器

### 代码质量
- **Biome** `2.3.8` - 超快速Linter & Formatter（替代ESLint + Prettier）
- **Husky** `9.1.7` - Git Hooks管理
- **lint-staged** `16.2.7` - 对暂存文件运行Linters

### 测试框架
- **Jest** `30.2.0` - 单元测试框架
  - `@swc/jest` `0.2.39` - Jest的SWC转换器
  - `jest-stare` `2.5.3` - 可视化测试报告
- **Cypress** `15.7.1` - E2E测试框架
- **Selenium WebDriver** `4.38.0` - 浏览器自动化

### 开发工具
- **Why Did You Render** `10.0.1` - React性能监控
- **Scripty** `3.0.0` - 脚本管理工具

### Webpack插件
- **Clean Webpack Plugin** `4.0.0` - 清理构建目录
- **HTML Webpack Plugin** `5.6.5` - HTML生成
- **Friendly Errors Plugin** - 友好的错误提示
- **Themed Progress Plugin** `1.0.1` - 美化构建进度条
- **Terser Plugin** `5.3.15` - JavaScript压缩
- **CSS Minimizer Plugin** `7.0.3` - CSS压缩

---

## 📁 项目架构

### 目录结构

\`\`\`
my-spa/
├── .husky/                    # Git Hooks配置
│   ├── pre-commit            # 提交前检查
│   └── commit-msg            # 提交消息验证
├── config/                    # 构建配置
│   ├── webpack.development.js # 开发环境配置
│   └── webpack.production.js  # 生产环境配置
├── cypress/                   # E2E测试
│   ├── fixtures/             # 测试数据
│   └── support/              # 测试支持文件
├── public/                    # 静态资源
│   └── favicon.ico
├── scripts/                   # 构建脚本
│   └── client/
│       └── dev.sh            # 开发脚本
├── src/
│   ├── abis/                 # 智能合约ABI
│   │   └── InfoContract.json
│   ├── components/           # React组件
│   │   ├── dapp/            # DApp组件
│   │   └── demo/            # 示例组件
│   ├── hooks/               # 自定义Hooks
│   │   ├── useImmer.ts      # Immer Hook
│   │   └── useAtomImmer.ts  # Jotai + Immer Hook
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── routes/              # 路由配置
│   │   └── index.tsx
│   ├── store/               # Jotai状态存储
│   │   └── dappStore.ts     # DApp状态管理
│   ├── types/               # TypeScript类型
│   │   ├── global.d.ts      # 全局类型声明
│   │   └── typechain-types/ # TypeChain生成的类型
│   ├── utils/               # 工具函数
│   ├── index.tsx            # 应用入口
│   ├── index-dev.html       # 开发环境HTML模板
│   ├── index-prod.html      # 生产环境HTML模板
│   ├── style.css            # 全局样式（Tailwind）
│   └── wdyr.tsx             # Why Did You Render配置
├── tests/
│   ├── e2e/                 # E2E测试
│   └── unit/                # 单元测试
├── .gitignore
├── biome.json               # Biome配置
├── cypress.config.js        # Cypress配置
├── jest.config.js           # Jest配置
├── package.json
├── postcss.config.js        # PostCSS配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── webpack.config.js        # Webpack主配置
\`\`\`

### 架构特点

#### 1. **模块化架构**
- 清晰的目录分层（components/pages/layouts/hooks/store）
- 路径别名配置（@/, @components, @pages等）
- 组件按功能模块组织

#### 2. **状态管理策略**
\`\`\`typescript
// Jotai原子化状态管理
store/
├── dappStore.ts          # DApp相关状态
│   ├── dappAtom          # 主状态atom
│   ├── accountAtom       # 派生atoms（只读）
│   ├── setAccountAtom    # 操作atoms（可写）
│   └── ...
\`\`\`

#### 3. **Web3集成模式**
\`\`\`
Web3 Layer
├── abis/                 # 智能合约ABI
├── types/typechain-types/ # 类型安全的合约接口
├── hooks/                # Web3相关hooks
└── store/dappStore.ts    # Web3状态管理
\`\`\`

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 开发模式

\`\`\`bash
# 启动开发服务器（端口3000）
pnpm client:server

# 或使用自定义脚本
pnpm client:dev
\`\`\`

### 生产构建

\`\`\`bash
# 构建生产版本
pnpm client:prod
\`\`\`

---

## 💻 开发指南

### 可用命令

\`\`\`bash
# 开发
pnpm client:dev          # Webpack开发构建
pnpm client:prod         # Webpack生产构建
pnpm client:server       # 启动开发服务器

# 代码质量
pnpm lint                # 运行Biome检查
pnpm lint:fix            # 自动修复问题
pnpm format              # 格式化代码

# 测试
pnpm test                # 运行单元测试
pnpm test:e2e            # 打开Cypress E2E测试
\`\`\`

### 路径别名

项目配置了以下路径别名：

\`\`\`typescript
import { Component } from '@/components/Component'
import { useSomeHook } from '@hooks/useSomeHook'
import InfoContractABI from '@abis/InfoContract.json'
\`\`\`

---

## 💡 优化建议

### 🎯 短期优化

1. **资源优化** - favicon.ico过大 (4.46 MiB)，建议压缩或使用SVG
2. **代码分割** - 使用React.lazy()和Suspense实现路由懒加载
3. **Web3缓存** - 添加@tanstack/react-query缓存合约调用
4. **错误边界** - 添加react-error-boundary

### 🚀 中期优化

1. **迁移到Vite** - 构建速度提升10-100倍
2. **Storybook** - 组件文档和开发
3. **Sentry** - 错误监控
4. **Bundle分析** - webpack-bundle-analyzer

### 🎨 长期优化

1. **Monorepo** - pnpm workspace管理多包
2. **PWA** - 离线支持和性能提升
3. **CI/CD** - GitHub Actions自动化
4. **性能监控** - Web Vitals

---

## 📄 许可证

ISC

---

**Happy Coding! 🎉**
