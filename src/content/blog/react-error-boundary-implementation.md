---
title: ErrorBoundary Card
description: 使用 React ErrorBoundary 捕获组件错误，实现优雅的错误处理和兜底展示，提升应用稳定性和用户体验。
date: 2025-11-27
tags: ["react"]
category: 技术
---

> 包含错误边界处理的通用卡片

# 解决什么问题

- 拒绝白屏❌，优化页面使用体验😊
- 使用该组件包裹的后，组件内部js代码报错将会被捕获，展示兜底内容
- 项目稳定性建设

# 实现原理

使用React API [getDerivedStateFromError](https://zh-hans.react.dev/reference/react/Component#static-getderivedstatefromerror)捕获组件报错，并修改hasError状态为true，展示兜底内容。
注意：函数式组件中目前还没有与 static getDerivedStateFromError 直接等同的东西。如果你想避免创建类式组件，请像上面那样编写一个 ErrorBoundary 组件，并在整个应用程序中使用它。或者使用 [react-error-boundary](https://github.com/bvaughn/react-error-boundary) 包来执行此操作。

# 核心代码

> "vite": "^3.0.4"
> "react": "^18.2.0",
> "antd": "^5.5.2"
> "styled-components": "^6.1.19"

Card：

```ts
import React, { FC, useMemo } from "react";
import styled from "styled-components";
import classNames from "classnames";
import { Spin, Tooltip } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import ErrorBoundary from "./ErrorBoundary";

interface TitleProps {
  showTipIcon?: boolean;
  tooltip?: React.ReactNode;
  content?: React.ReactNode;
  suffix?: React.ReactNode;
}

interface CardProps {
  title?: React.ReactNode | TitleProps;
  extra?: React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CardWrapper = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
`;

const TitleContent = styled.div`
  display: inline-flex;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: #000;
`;

const Card: FC<CardProps> = ({ title, extra, loading = false, className, style, children }) => {
  const hasTitle = useMemo(() => Boolean(title), [title]);
  const hasExtra = useMemo(() => Boolean(extra), [extra]);

  return (
    <ErrorBoundary>
      <Spin spinning={loading}>
        <CardWrapper className={className} style={style}>
          <div className="flex justify-between items-center gap-24">
            {hasTitle && typeof title === "object" && "content" in title && (
              <div className="flex justify-between items-center">
                {title.showTipIcon && <QuestionOutlined />}
                {"tooltip" in title ? (
                  <Tooltip content={title.tooltip}>
                    <TitleContent>{title.content}</TitleContent>
                  </Tooltip>
                ) : (
                  <TitleContent>{title.content}</TitleContent>
                )}
                {title.suffix && <div className="ml-8">{title.suffix}</div>}
              </div>
            )}
            {hasTitle && typeof title !== "object" && <TitleContent>{title}</TitleContent>}
            {hasExtra && <div>{extra}</div>}
          </div>
          <div className={classNames({ "mt-20": hasTitle || hasExtra })}>{children}</div>
        </CardWrapper>
      </Spin>
    </ErrorBoundary>
  );
};

export default Card;
```

ErrorBoundary：

```ts
import React from "react";
import { Empty } from 'antd';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("ErrorBoundary caught an error", error, errorInfo);
    // TOTO: 手动上报到监控服务器
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-lg bg-white p-8">
            <Empty description="组件内部发生了错误，请联系管理员" />
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

# 如何使用

```ts
function addComment(comment?) {
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  useEffect(() => {
    // 被ErrorBoundary捕获😊
    console.log(good.bbbb);
    // 计时器报错不会被ErrorBoundary捕获🙁
    const timer = setTimeout(() => {
      console.log(good.aaaa);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <button
      onClick={() => {
        // 事件不会被ErrorBoundary捕获🙁
        addComment();
      }}
    >
      Add comment
    </button>
  );
}


<div className="p-2 bg-black">
  <Cardtitle="Hello world">
    <AddCommentButton />
  </Card>
</div>
```

# 效果

![效果](https://i-blog.csdnimg.cn/direct/21a453c99ff24898ae9255537c83bf63.png)

# 总结

| 错误类型         | 捕获方式                  | 是否被 ErrorBoundary 捕获 |
| ---------------- | ------------------------- | ------------------------- |
| 同步渲染错误     | React 自动捕获            | 是                        |
| 生命周期钩子错误 | React 自动捕获            | 是                        |
| 异步代码错误     | 手动 try-catch + useState | 否                        |
| 事件处理函数错误 | 手动 try-catch            | 否                        |
