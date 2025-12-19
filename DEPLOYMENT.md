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
   - 构建命令: `pnpm client:prod`
   - 构建输出目录: `dist`
6. 添加环境变量 `REACT_APP_API_URL`
7. 点击 "保存并部署"

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

## 故障排查

### 路由 404 问题
确保 `public/_redirects` 文件存在且被正确复制到 dist 目录。

### 环境变量不生效
检查 Cloudflare Pages 控制台中的环境变量配置，确保变量名正确。

### 构建失败
- 检查 Node.js 版本是否 >= 18
- 确保所有依赖已正确安装
- 查看 Cloudflare Pages 构建日志获取详细错误信息

## 参考链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
