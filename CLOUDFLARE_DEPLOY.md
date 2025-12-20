# Cloudflare Pages 快速部署指南

## 🚀 部署步骤

### 1. 在 Cloudflare Pages 控制台配置

访问 [Cloudflare Pages](https://dash.cloudflare.com/) 并：

1. **创建项目** → 连接 Git 仓库
2. **构建配置**：
   ```
   框架预设: 无 (None)
   构建命令: pnpm client:prod
   构建输出目录: dist
   根目录: /
   ```

3. **环境变量**（必须配置）：
   ```
   BACKEND_API_URL = https://nvdv338g40.execute-api.us-east-1.amazonaws.com/dev
   ```

   **注意**：这是后端 API 的实际地址，用于 Cloudflare Pages Functions 代理转发。

4. **保存并部署**

**重要**：不要在构建命令中添加 `wrangler pages deploy`，Cloudflare Pages 会自动处理部署！

## 🔧 API 代理配置

本项目使用 **Cloudflare Pages Functions** 来代理后端 API 请求，解决跨域问题。

### 工作原理
1. 前端发送请求到 `/api/*`（相对路径）
2. Cloudflare Pages Functions 拦截这些请求
3. 转发到配置的后端 API（通过 `BACKEND_API_URL` 环境变量）
4. 添加 CORS 响应头后返回给前端

### 相关文件
- `functions/api/[[path]].ts` - API 代理函数，处理所有 `/api/*` 请求

## ⚠️ 当前已知问题

### favicon.ico 文件过大
- **问题**：当前 favicon.ico 为 4.5MB，会导致 webpack 警告
- **影响**：不影响部署，但会降低页面加载速度

#### 推荐方案
使用在线工具生成优化的 favicon：
1. 访问 https://favicon.io/
2. 上传你的 logo 图片
3. 下载生成的 favicon.ico（通常 < 50KB）
4. 替换 `public/favicon.ico`

## 🔍 常见部署错误

### ❌ wrangler: not found
- **原因**：构建命令中包含了 `wrangler pages deploy`
- **解决**：构建命令只需要 `pnpm client:prod`

### ❌ 环境变量不生效
- **检查**：Cloudflare Pages 控制台 → 设置 → 环境变量
- **确认**：变量名为 `BACKEND_API_URL`（不要拼写错误）
- **说明**：该变量用于 Cloudflare Pages Functions 代理转发到后端 API

### ⚠️ 构建警告：资源过大
- **影响**：不会导致部署失败，只是性能警告
- **优化**：参考上面的 favicon 优化方案

## ✅ 验证部署成功

部署完成后检查：
1. 访问你的 Pages URL
2. 测试 SPA 路由（如 `/about`）
3. 检查浏览器控制台是否有错误
4. 验证 API 调用是否正常

## 📝 自动部署

配置完成后：
- **主分支推送** → 自动部署到生产环境
- **其他分支/PR** → 自动创建预览部署

---

详细文档请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
