# Husky Git Hooks

This directory contains Git hooks managed by Husky to ensure code quality.

## Available Hooks

### pre-commit
Runs before each commit to check code quality:
- **lint-staged**: Runs linting and formatting on staged files only
  - TypeScript/JavaScript files: `biome check --write`
  - JSON/Markdown files: `biome format --write`

### commit-msg
Validates commit messages follow conventional commits format:
- **Format**: `<type>(<scope>): <subject>`
- **Types**: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert
- **Examples**:
  - `feat: add wallet connection`
  - `fix(dapp): resolve contract interaction issue`
  - `docs: update README`

## Bypassing Hooks

If you need to bypass hooks (not recommended):

```bash
# Skip pre-commit hook
git commit --no-verify -m "message"

# Skip all hooks
HUSKY=0 git commit -m "message"
```

## Configuration

Hook configurations are defined in:
- Husky scripts: `.husky/pre-commit`, `.husky/commit-msg`
- lint-staged config: `package.json` → `lint-staged` field

## Manual Setup

If hooks are not working, run:

```bash
# In the root git directory
git config core.hooksPath my-spa/.husky

# Or reinstall hooks
pnpm prepare
```
