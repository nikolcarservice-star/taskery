import Markdown from "react-markdown";
import { isSafeHttpUrl } from "@/lib/safe-url";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-zinc max-w-none text-sm leading-7 ${className ?? ""}`}
    >
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-2xl font-bold text-zinc-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-xl font-semibold text-zinc-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold text-zinc-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-zinc-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-zinc-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 text-zinc-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-900">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
              {children}
            </pre>
          ),
          a: ({ href, children }) => {
            if (!href || !isSafeHttpUrl(href)) {
              return <span className="text-zinc-700">{children}</span>;
            }
            return (
              <a
                href={href}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
