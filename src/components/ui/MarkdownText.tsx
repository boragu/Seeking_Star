import React from "react";

interface MarkdownTextProps {
  content: string;
  className?: string;
}

/**
 * 인라인 마크다운 (볼드, 코드, 강조) 파싱 함수
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  // 정규식으로 **bold** 및 `code` 처리
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={`code-${match.index}`} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.9em] text-teal">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`em-${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * 블록 단위 마크다운 파서 (불릿 리스트, 번호 리스트, 단락)
 */
export function MarkdownText({ content, className = "" }: MarkdownTextProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: React.ReactNode[] } | null = null;

  const flushList = (keyPrefix: number) => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="my-1.5 space-y-1 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
              <div className="flex-1 leading-relaxed">{item}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${keyPrefix}`} className="my-1.5 space-y-1 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-mono text-[11px] font-bold text-teal">{idx + 1}.</span>
              <div className="flex-1 leading-relaxed">{item}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // 불릿 리스트 매칭 (•, -, *)
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.+)$/);
    if (bulletMatch) {
      if (currentList && currentList.type !== "ul") {
        flushList(index);
      }
      if (!currentList) {
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(renderInlineMarkdown(bulletMatch[2]));
      return;
    }

    // 번호 리스트 매칭 (1., 2.)
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      if (currentList && currentList.type !== "ol") {
        flushList(index);
      }
      if (!currentList) {
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(renderInlineMarkdown(numberMatch[2]));
      return;
    }

    // 일반 문단
    flushList(index);
    elements.push(
      <p key={`p-${index}`} className="my-1 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className={`text-ink ${className}`}>{elements}</div>;
}
