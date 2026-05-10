# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — 本地开发（localhost:4321）
- `npm run build` — 生成静态站点到 `./dist`
- `npm run preview` — 预览构建产物
- `npm run check` — `astro check`，类型与内容集合校验
- `npm run lint` / `npm run lint:fix` — ESLint（`--max-warnings=0`，CI 会卡住警告）
- `npm run format` / `npm run format:check` — Prettier 格式化 / 检查

安装依赖请使用 `npm install`；CI 在 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 中使用 `npm ci --legacy-peer-deps`，添加/升级依赖时需保持能在该模式下安装通过。Node 要求 >= 22.12.0（见 [package.json](package.json) `engines`）。

提交时 Husky + lint-staged 会对改动文件跑 `eslint --fix` + `prettier --write`（配置在 [package.json](package.json) `lint-staged` 字段与 [.husky/pre-commit](.husky/pre-commit)）。

## Code style

规范工具：**Prettier**（格式化唯一来源，配置见 [.prettierrc.mjs](.prettierrc.mjs)）+ **ESLint 9 flat config**（见 [eslint.config.js](eslint.config.js)）+ **EditorConfig**。格式化与 lint 冲突交由 `eslint-config-prettier` 关闭。

核心约定（不要和工具对着干，有分歧就改工具不改代码）：

- 缩进 2 空格；双引号；句末分号；`printWidth: 100`；`trailingComma: "es5"`；LF 换行。
- 类型导入用 `import type` / inline `import { type X }`（ESLint 会自动修）。
- `@typescript-eslint/no-unused-vars` 下划线前缀豁免（`_unused`）。
- Tailwind class 顺序交给 `prettier-plugin-tailwindcss`，不要手动排。

命名与结构：

- 组件文件名 = 默认导出名，`PascalCase`；工具 / hooks 文件 `camelCase`。
- 组件按领域分目录：`src/components/<domain>/<Component>.tsx`（现有 `blog` / `hero` / `particles`）；未来多个页面共用的原子组件再考虑 `src/components/ui/`。
- Props interface 就近声明，命名 `<ComponentName>Props`。
- 常量、动画 variants 提到组件外部顶层模块作用域，缓动数组等用 `as const`；动画缓动统一复用 `EASE` 常量（见 [src/components/blog/BlogStats.tsx](src/components/blog/BlogStats.tsx:11)），不要每个组件重写一遍。
- 跨组件类型放 [src/types/index.ts](src/types/index.ts)，不要散落在各组件文件里。

注释风格：有价值的 WHY 才写（隐藏约束、反直觉的取舍、绕过某个 bug），well-named 的代码不配注释；不逐行翻译代码。

## Commits

沿用 Conventional Commits（`feat:` / `fix:` / `chore:` / `docs:` / `refactor:` / `style:` / `perf:` / `test:` / `ci:`），**约定但不强制**——没有 commitlint 校验，靠自觉。

## Architecture

纯静态的 Astro 6 + React 19 博客，部署到 GitHub Pages（`output: "static"`，站点 URL 在 [astro.config.mjs](astro.config.mjs) 中写死为 `https://Eli-Yangg.github.io`）。主分支 push 即由 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 构建并发布 `./dist`。

**Astro / React 分工**：页面和布局使用 `.astro`（[src/pages/](src/pages/)、[src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro)），有状态/交互的 UI 写成 React `.tsx` 并通过 client 指令挂载。参考 [src/pages/index.astro](src/pages/index.astro)：`ParticlesBackground`、`TimelineWatermark` 用 `client:load`，`BlogStats` 也是 `client:load`。新增交互组件时保持这个划分，不要把状态逻辑塞进 `.astro`。

**内容集合**：博客文章是 `astro:content` collection，schema 在 [src/content.config.ts](src/content.config.ts) 里，必填 `title` / `description` / `date`，可选 `tags[]` / `category`。文章放在 [src/content/blog/](src/content/blog/)，支持 `.md` / `.mdx`。如果要扩展字段，必须同步更新 schema 和所有现有文章的 frontmatter，否则构建会因为 zod 校验失败。

**博客统计管线**：[src/lib/blog.ts](src/lib/blog.ts) 的 `calculateBlogStats()` 在**构建时**（[src/components/BlogStatsSection.astro](src/components/BlogStatsSection.astro) frontmatter 中）调用，把文章聚合成 `BlogStats`（总数 / 字数 / 分类 / timeline / 回溯 52 周的 `dailyContributions`），然后作为 prop 传给 React 组件 [src/components/blog/BlogStats.tsx](src/components/blog/BlogStats.tsx) 和 [src/components/blog/ContributionGraph.tsx](src/components/blog/ContributionGraph.tsx)。新增统计维度要改动三处：[src/types/index.ts](src/types/index.ts) 的 `BlogStats`、`calculateBlogStats` 的聚合逻辑、消费这些字段的 React 组件。

**文章路由**：[src/pages/blog/[slug].astro](src/pages/blog/[slug].astro) 用 `getStaticPaths()` 基于 collection entry 的 `id` 生成静态路由，并用 `render(entry)` 渲染 MDX。

**样式**：Tailwind 4 通过 [@tailwindcss/vite](astro.config.mjs) 加载（不是传统的 Astro Tailwind integration）。全局样式入口 [src/styles/global.css](src/styles/global.css) 仅由 [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) 导入。部分页面级样式用 `<style is:global>` 内联（见 index.astro、blog/[slug].astro 中的 `.glass` / `.prose` 覆盖）。

**共享类型**：集中在 [src/types/index.ts](src/types/index.ts)，新增跨组件类型放这里。
