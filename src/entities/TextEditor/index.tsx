"use client";

import LinkIcon from "@/assets/icons/LinkIcon";
import React, { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TextEditorProps {
  placeholder?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  value?: string;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ size = "medium", className, onChange, placeholder, readOnly, value }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [content, setContent] = useState(value || "");

    // `value`가 변경되었을 때만 반영
    useLayoutEffect(() => {
      if (editorRef.current && value !== undefined) {
        editorRef.current.innerHTML = value;
        setContent(value.trim());
      }
    }, [value]);

    // 선택한 텍스트를 <span>으로 감싸 스타일 적용
    const applyStyle = (style: "font-bold" | "italic" | "underline") => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (range.collapsed) return; // 선택된 텍스트가 없으면 무시

      const span = document.createElement("span");
      span.classList.add(style);

      span.appendChild(range.extractContents()); // 선택된 텍스트를 span에 추가
      range.insertNode(span); // span을 삽입
    };

    // 링크 삽입
    const insertLink = () => {
      const url = prompt("Enter the link URL");
      if (!url) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (range.collapsed) return; // 선택된 텍스트가 없으면 무시

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.add("text-blue-500", "underline");

      link.appendChild(range.extractContents());
      range.insertNode(link);
    };

    // `onBlur`에서 값이 변경된 경우만 `onChange` 호출
    const handleBlur = () => {
      setIsFocused(false);
      if (editorRef.current) {
        const newValue = editorRef.current.innerHTML.trim();
        if (newValue !== value) {
          onChange?.(newValue);
        }
      }
    };

    return (
      <div className={twMerge("w-full flex flex-col gap-2", className)}>
        <div
          className={twMerge(
            "relative w-full",
            isFocused && "border-b border-gray-300"
          )}
        >
          <span
            className={twMerge(
              "absolute -bottom-px left-0 w-full h-[2px] scale-x-0 bg-blue-500 transition-transform will-change-transform",
              isFocused && "scale-x-100"
            )}
          ></span>
          <div
            ref={(node) => {
              editorRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            contentEditable={!readOnly}
            onFocus={() => !readOnly && setIsFocused(true)}
            onBlur={handleBlur}
            onInput={(e) => setContent(e.currentTarget.innerText.trim())}
            className={twMerge(
              "w-full relative bg-transparent editor outline-none",
              size === "small" && "text-sm py-1",
              size === "medium" && "text-base py-2",
              size === "large" && "text-lg py-3"
            )}
          />
          {content.trim() === "" && (
            <span
              className={twMerge(
                "text-gray-500 absolute top-0 left-0 pointer-events-none",
                size === "small" && "text-sm py-1",
                size === "medium" && "text-base py-2",
                size === "large" && "text-lg py-3"
              )}
            >
              {placeholder}
            </span>
          )}
        </div>
        {isFocused && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => applyStyle("font-bold")}
              aria-label="Bold"
              className="text-sm font-bold w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-sm"
            >
              B
            </button>
            <button
              onClick={() => applyStyle("italic")}
              aria-label="Italic"
              className="text-sm italic font-serif w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-sm"
            >
              I
            </button>
            <button
              onClick={() => applyStyle("underline")}
              aria-label="Underline"
              className="text-sm underline w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-sm"
            >
              U
            </button>
            <button
              onClick={insertLink}
              aria-label="Insert Link"
              className="text-sm w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-sm"
            >
              <LinkIcon className="text-gray-500 w-4 h-4 mx-auto" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;