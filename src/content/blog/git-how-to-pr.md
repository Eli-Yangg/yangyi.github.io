---
title: 开发完成后如何正确提CR
description: 掌握规范的 Git 工作流，通过 rebase、squash 等技巧保证提交简洁，确保 CR（代码审查）流程高效顺畅。
date: 2025-11-13
tags: ["git", "workflow"]
category: 技术
---

> 开发完后应当保证以下几点才算合格：
>
> 1. 保证commit 简洁, 只有一条, 目的是保持 history 简洁
> 2. 无冲突
> 3. 所有检测均正常通过(至少保证无error 检测报错)

## 如何保证commit 简洁

比如下图一中的提交, 包含三个commit, 提交到远端后在MR 页面能够看到对应三个提交, 如果不合并这三个commit, 造成的结果是会看到对应修改代码历史中三次提交, 比较混乱
![[图片]](https://i-blog.csdnimg.cn/direct/676ce5045ed44fbaa55c40d5a58bd028.png)

### 步骤一: rebase master

```shell
// 首先 checkout master, 拉远端 master 最新代码
git checkout master
git pull

// 然后checkout 本地待提交分支
git checkout ${branch}    // 或者 git checkout -

// rebase master
git rebase master
```

### 步骤二: 解决冲突( 若有 )

```shell
// 解决冲突后
git add .
// 继续rebase
git rebase --continue
```

rebase master 后的成功提示:
![[图片]](https://i-blog.csdnimg.cn/direct/1c26071b59ce4a458546c09d230b974c.png)

### 步骤三: 合并commit

```shell
// 首先, 查看上一个人合并到master 的 commit id, 图三种本次合并的id 为 9720c9eb
git log --oneline

// 合并记录, 交互窗口如
git rebase -i 9720c9eb

// 此处按 i 进入vim交互模型, 在不需要保留的commit 中用s 标明, 如图五
p/pick 代表保留, s/squash 代表不保留, 也可以修改对应的 commit

// 保存
:wq

// 修改对应 commit msg
用#可以隐藏对应msg, 如图六

// 保存
:wq
```

图三
![[图片]](https://i-blog.csdnimg.cn/direct/8efaf36e19a14a4bbbb456b6528d3812.png)
图四
![[图片]](https://i-blog.csdnimg.cn/direct/3f6e031209724cd8b8da77388b8dba5b.png)
图五
![[图片]](https://i-blog.csdnimg.cn/direct/ca46a949d8fe4532a120df5a0c3f23fe.png)

## Push 到远端

```shell
git push -f origin ${branch}
```

![[图片]](https://i-blog.csdnimg.cn/direct/7ec758d354bb4c4b93d3eb36961c459f.png)

## 合并后的效果:

只有7a429f03 一条 commit
![[图片]](https://i-blog.csdnimg.cn/direct/21f8355e5728411bb41b1b507c095dbe.png)
MR 页面:
![[图片]](https://i-blog.csdnimg.cn/direct/dcf8f19fa6da4b9980b636da7a65be48.png)
