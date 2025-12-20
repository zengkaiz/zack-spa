# Cloudflare Pages 部署指南

本项目配置为可部署到 Cloudflare Pages。

## 部署配置

### 环境变量

在 Cloudflare Pages 控制台配置以下环境变量：

**生产环境：**
- `REACT_APP_API_URL`: 你的生产环境 API 地址
  - 示例: `https://nvdv338g40.execute-api.us-east-1.amazonaws.com/dev`

**预览环境：**
- `REACT_APP_API_URL`: 你的预览环境 API 地址（可选）

### 构建配置

在 Cloudflare Pages 项目设置中配置：

- **构建命令**: `pnpm client:prod`
- **构建输出目录**: `dist`
- **根目录**: `/`
- **Node.js 版本**: `18` 或更高

### 项目文件说明

- `public/_redirects`: SPA 路由重定向配置，所有路由都指向 index.html
- `public/_headers`: HTTP 响应头配置，包含安全头和缓存策略
- `wrangler.toml`: Cloudflare Pages 项目配置

## 部署方法

### 方法 1: 通过 Cloudflare Pages 控制台（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 部分
3. 点击 "创建项目"
4. 连接你的 GitHub/GitLab 仓库
5. 配置构建设置：
   - **框架预设**: 无/None
   - **构建命令**: `pnpm client:prod`
   - **构建输出目录**: `dist`
   - **根目录**: `/`（默认）
   - **环境变量**:
     - 添加 `REACT_APP_API_URL` = 你的 API 地址
6. 点击 "保存并部署"

**重要提示**: Cloudflare Pages 会自动处理部署，不需要在构建命令中运行 `wrangler pages deploy`。构建完成后会自动部署 dist 目录。

### 方法 2: 使用 Wrangler CLI

安装 Wrangler CLI：

```bash
npm install -g wrangler
```

登录 Cloudflare：

```bash
wrangler login
```

部署项目：

```bash
# 构建项目
pnpm client:prod

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=my-spa
```

## 自动部署

连接 GitHub 仓库后，Cloudflare Pages 会自动：
- 在推送到主分支时部署到生产环境
- 在推送到其他分支或创建 PR 时创建预览部署

## 环境配置

### 开发环境
使用 `.env.development` 文件配置本地开发环境变量。

### 生产环境
在 Cloudflare Pages 控制台中配置生产环境变量：
1. 进入你的 Pages 项目
2. 点击 "设置" > "环境变量"
3. 添加 `REACT_APP_API_URL` 变量

## 缓存策略

项目配置了智能缓存策略（见 `public/_headers`）：
- 静态资源（JS、CSS、图片）：1年缓存，immutable
- index.html：不缓存，确保总是获取最新版本

## 安全配置

自动添加的安全响应头（见 `public/_headers`）：
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
- `X-XSS-Protection: 1; mode=block` - XSS 保护
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer 策略

## 性能优化建议

### 优化 favicon.ico
当前的 favicon.ico 文件较大（4.5MB），建议优化：

1. **在线工具优化**:
   - 使用 [favicon.io](https://favicon.io/) 生成标准大小的 favicon
   - 使用 [TinyPNG](https://tinypng.com/) 压缩图标

2. **推荐规格**:
   - 尺寸: 16x16, 32x32, 48x48
   - 文件大小: < 100KB
   - 格式: ICO 或 PNG

3. **替换步骤**:
   ```bash
   # 备份原文件
   mv public/favicon.ico public/favicon.ico.bak

   # 添加新的优化后的 favicon.ico
   # 重新构建
   pnpm client:prod
   ```

## 故障排查

### 部署失败：wrangler: not found
**原因**: 在 Cloudflare Pages 自动构建中不需要运行 `wrangler` 命令。

**解决方案**:
- 确保构建命令只是 `pnpm client:prod`
- Cloudflare Pages 会自动部署 dist 目录的内容
- 不要添加 `wrangler pages deploy` 到构建命令

### 路由 404 问题
确保 `public/_redirects` 文件存在且被正确复制到 dist 目录。

### 环境变量不生效
检查 Cloudflare Pages 控制台中的环境变量配置，确保变量名正确。

### 构建失败
- 检查 Node.js 版本是否 >= 18
- 确保所有依赖已正确安装
- 查看 Cloudflare Pages 构建日志获取详细错误信息

### 资源文件过大警告
如果看到 webpack 警告文件过大：
- 优化图片和 favicon（参考上面的优化建议）
- 考虑使用代码分割（code splitting）
- 启用 gzip/brotli 压缩（Cloudflare 自动提供）

## 参考链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
