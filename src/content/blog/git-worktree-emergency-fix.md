---
title: 来了个紧急需求，试试用git worktree
description: 使用Git Worktree优雅地处理紧急需求，无需暂存当前工作。学习如何在同一仓库创建多个独立工作树并行开发。
date: 2025-12-31
tags: ["git"]
category: 技术
---

> 有个紧急需求插入进来，还在慌忙git commit暂存代码吗？了解git worktree后我优雅的去茶水间接了一杯咖啡，从容应对☕️

## 什么是Git Worktree

`Git Worktree` 是 Git 提供的一个功能，允许你在同一个 Git 仓库中创建多个独立的工作树（working trees）。每个工作树可以对应不同的分支，并且它们共享同一个仓库的 `.git` 目录，但拥有各自的工作目录。这使得你可以在不切换分支的情况下同时处理多个任务，非常适合需要并行开发或紧急修复的场景。

**本质上是创建了新的目录管理项目，只不过与原仓库用了同一个.git目录**

## 核心概念

- 主工作树（Main Worktree）：
  - 默认的工作树，通常是你克隆仓库时创建的目录。
  - 通过 `git init` 或 `git clone` 生成。
- 附加工作树（Additional Worktree）：
  - 通过 `git worktree add` 命令创建。
  - 每个附加工作树可以关联到不同的分支或提交。

## 主要功能

### 创建新的工作树：

```shell
git worktree add -b <branch> <path>
```

- `<path>`：新工作树的目录路径。
- `<branch>`：关联的分支（可以是现有分支或新分支）。

示例：

```shell
git worktree add -b feature/awesome ../feature-branch
```

### 列出所有工作树：

```shell
git worktree list
```

输出事例：

```shell
/path/to/main      abc123 [main]
/path/to/feature   def456 [feature/awesome]
```

### 删除工作树：

```shell
git worktree remove <path>
```

或直接删除目录后清理引用：

```shell
git worktree prune
```

### 锁定与解锁：

锁定工作树（防止误操作）：

```shell
git worktree lock <path>
```

解锁工作树：

```shell
git worktree unlock <path>
```

## 工作流

来了紧急需求 --> 创建worktree --> 开发 --> 上线 --> 删除worktree --> 返回主工作树开发原需求 --> 喝咖啡

## 对比

| 工具         | 优点                         | 缺点             | 适用场景                     |
| ------------ | ---------------------------- | ---------------- | ---------------------------- |
| Git Commit   | 正式记录版本历史，便于协作   | 产生意外的提交   | 阶段性成果保存或紧急修复提交 |
| Git Stash    | 快速保存未提交更改，灵活恢复 | 可能遗忘暂存状态 | 临时切换任务，快速恢复进度   |
| Git Worktree | 多任务并行，隔离分支依赖     | 占用额外磁盘空间 | 长期和短期任务并行开发       |

## 总结

`Git Worktree` 是一个强大的工具，特别适合需要多任务并行或隔离环境的开发场景。它通过共享仓库数据减少冗余，同时提供独立的工作目录，是 `git stash` 和分支切换的补充方案。合理使用可以显著提升开发效率！
