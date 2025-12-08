# Husky 配置说明

## 已完成的配置

### 1. 安装的依赖
- **husky**: ^9.1.7 - Git hooks 管理工具
- **lint-staged**: ^16.2.7 - 对 staged 文件运行 linters

### 2. Git Hooks

#### pre-commit
在每次提交前自动运行，检查代码质量：
```bash
# 自动运行 lint-staged
pnpm lint-staged
```

**处理的文件类型：**
- `*.{ts,tsx,js,jsx}` - 运行 `biome check --write`
- `*.{json,md}` - 运行 `biome format --write`

#### commit-msg
验证提交消息格式，强制使用 Conventional Commits 规范：

**格式要求：**
```
<type>(<scope>): <subject>
```

**支持的类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动
- `build`: 构建系统或外部依赖项的变更
- `ci`: CI 配置文件和脚本的变更
- `revert`: 回退之前的 commit

**示例：**
```bash
git commit -m "feat: add wallet connection feature"
git commit -m "fix(dapp): resolve contract interaction issue"
git commit -m "docs: update README with installation steps"
git commit -m "refactor: simplify state management logic"
```

### 3. 配置文件

**package.json:**
```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "biome check --write --no-errors-on-unmatched"
    ],
    "*.{json,md}": [
      "biome format --write --no-errors-on-unmatched"
    ]
  }
}
```

**Git config:**
```bash
# Hooks 路径已配置为
git config core.hooksPath my-spa/.husky
```

### 4. 文件结构
```
my-spa/
├── .husky/
│   ├── _/
│   │   └── husky.sh          # Husky 辅助脚本
│   ├── pre-commit            # Pre-commit hook
│   ├── commit-msg            # Commit message hook
│   └── README.md             # Hooks 说明文档
├── package.json
└── HUSKY_SETUP.md           # 本文件
```

## 使用说明

### 正常工作流
```bash
# 1. 添加文件到暂存区
git add .

# 2. 提交（会自动运行 pre-commit 检查）
git commit -m "feat: add new feature"

# 3. 如果代码格式有问题，会自动修复并需要重新添加
git add .
git commit -m "feat: add new feature"
```

### 跳过 Hooks（不推荐）

```bash
# 跳过所有 hooks
git commit --no-verify -m "message"

# 或使用环境变量
HUSKY=0 git commit -m "message"
```

### 手动运行检查

```bash
# 运行 lint-staged（检查暂存文件）
pnpm lint-staged

# 运行完整 lint
pnpm lint

# 运行 lint 并自动修复
pnpm lint:fix
```

## 故障排查

### Hooks 不工作？

1. **检查 git hooks 路径：**
   ```bash
   cd /Users/zhang/Documents/my/web3-code
   git config core.hooksPath
   # 应该显示: my-spa/.husky
   ```

2. **重新设置 hooks 路径：**
   ```bash
   cd /Users/zhang/Documents/my/web3-code
   git config core.hooksPath my-spa/.husky
   ```

3. **检查 hook 文件权限：**
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   chmod +x .husky/_/husky.sh
   ```

4. **重新安装：**
   ```bash
   pnpm install
   ```

### Commit Message 被拒绝？

确保提交消息遵循格式：
```
<type>: <description>

# 或带 scope
<type>(<scope>): <description>
```

示例：
- ✅ `feat: add user authentication`
- ✅ `fix(api): resolve timeout issue`
- ❌ `added new feature` (缺少 type)
- ❌ `feat:add feature` (冒号后需要空格)

## 自定义配置

### 修改 lint-staged 规则

编辑 `package.json` 中的 `lint-staged` 字段：
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write",
      "pnpm test --findRelatedTests"  // 添加测试
    ]
  }
}
```

### 添加新的 Hook

```bash
# 创建新 hook (例如 pre-push)
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm test
' > .husky/pre-push

# 添加执行权限
chmod +x .husky/pre-push
```

## 最佳实践

1. **不要跳过 hooks** - 它们确保代码质量
2. **提交前测试** - 确保代码能通过检查
3. **小步提交** - 更容易通过 lint 检查
4. **使用规范的提交消息** - 便于生成 changelog

## 相关资源

- [Husky 文档](https://typicode.github.io/husky/)
- [lint-staged 文档](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Biome 文档](https://biomejs.dev/)
