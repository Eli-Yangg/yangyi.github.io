# Eli's Dev Blog

> A modern, beautiful personal blog built with Astro, React, and Tailwind CSS. Sharing insights on frontend development, performance optimization, and modern web technologies.

**Live Site:** [https://Eli-Yangg.github.io](https://Eli-Yangg.github.io)

---

## ✨ Features

- 🚀 **Lightning Fast** – Static site generation with Astro
- 🎨 **Beautiful UI** – Modern design with Tailwind CSS and framer-motion animations
- ⚛️ **Interactive** – React components for enhanced interactivity
- 📝 **MDX Support** – Write posts in Markdown or MDX with component support
- 📊 **Blog Analytics** – Track stats: total posts, word count, categories, weekly contributions
- 📱 **Responsive** – Mobile-first design
- 🎯 **Performance Optimized** – Optimized bundle size and load times
- 🌙 **Particle Effects** – Stunning animated particle background

---

## 🛠️ Tech Stack

- **Framework:** [Astro 6](https://astro.build)
- **UI Library:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Content Format:** MDX (Markdown + JSX)
- **Deployment:** GitHub Pages

---

## 📚 Blog Posts

All blog source files are located in [`src/content/blog/`](./src/content/blog/)

| Title                                                  | Date       | Category | Tags        |
| ------------------------------------------------------ | ---------- | -------- | ----------- |
| [我的第一篇技术博客](./src/content/blog/first-post.md) | 2026-05-08 | 技术     | Astro, 前端 |

_Note: Update this table when adding new blog posts._

---

## 🚀 Quick Start

### Prerequisites

- **Node.js:** >= 22.12.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

---

## 📖 Available Commands

All commands are run from the root directory:

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `npm run dev`            | Start local dev server at `localhost:4321`           |
| `npm run build`          | Build production site to `./dist/`                   |
| `npm run preview`        | Preview the production build locally                 |
| `npm run check`          | Run Astro type checking and content validation       |
| `npm run lint`           | Run ESLint with strict warnings (`--max-warnings=0`) |
| `npm run lint:fix`       | Fix ESLint issues automatically                      |
| `npm run format`         | Format code with Prettier                            |
| `npm run format:check`   | Check code formatting without changes                |
| `npm run astro -- <cmd>` | Run any Astro CLI command                            |

---

## 📁 Project Structure

```text
.
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── blog/       # Blog-specific components
│   │   ├── hero/       # Hero section components
│   │   └── particles/  # Particle effect components
│   ├── content/         # Content collections
│   │   └── blog/       # Blog post markdown files
│   ├── layouts/         # Layout components (Astro)
│   ├── lib/            # Utility functions (blog helpers, etc.)
│   ├── pages/          # Route pages (Astro)
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── .github/workflows/   # GitHub Actions workflows
├── astro.config.mjs    # Astro configuration
├── tailwind.config.ts  # Tailwind configuration
└── package.json        # Dependencies and scripts
```

---

## 📝 Writing Blog Posts

### Create a New Post

1. Create a new `.md` or `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields:

```markdown
---
title: Your Post Title
description: Brief description of your post
date: 2026-05-11
tags: ["tag1", "tag2"]
category: Category Name
---

# Your Post Title

Content goes here...
```

**Required frontmatter fields:**

- `title` (string) – Post title
- `description` (string) – Short description
- `date` (ISO date) – Publication date
- `tags` (string[]) – Array of tags (optional)
- `category` (string) – Category name (optional)

3. **Update the blog table in this README** – Add a new row with the post title, date, category, and link

The post will automatically be available at `/blog/[slug]`

---

## 🔧 Development Workflow

### Pre-commit Hooks

This project uses **Husky** + **lint-staged** for automatic code quality checks:

- ESLint fixes TypeScript/JavaScript files
- Prettier formats all code

Simply commit your changes – the hooks will run automatically.

### Code Style

- **Prettier:** Handles all formatting (indentation, line width, trailing commas, etc.)
- **ESLint:** Enforces code quality rules
- **EditorConfig:** Ensures consistent settings across editors

All configurations are in:

- [`.prettierrc.mjs`](./.prettierrc.mjs) – Prettier config
- [`eslint.config.js`](./eslint.config.js) – ESLint rules
- [`.editorconfig`](./.editorconfig) – Editor settings

---

## 🚢 Deployment

This site is deployed to **GitHub Pages** via the workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

**Deployment process:**

1. Push to `main` branch
2. GitHub Actions automatically runs:
   - `npm ci --legacy-peer-deps`
   - `npm run build`
   - Deploys `./dist` to GitHub Pages

The site is live at: [https://Eli-Yangg.github.io](https://Eli-Yangg.github.io)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Found a typo or issue? Feel free to:

- Open an issue
- Submit a pull request
- Contact me on [GitHub](https://github.com/Eli-Yangg)

---

## 📞 Get in Touch

- **GitHub:** [@Eli-Yangg](https://github.com/Eli-Yangg)
- **Blog:** [https://Eli-Yangg.github.io](https://Eli-Yangg.github.io)
