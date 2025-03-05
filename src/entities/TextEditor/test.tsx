import { render, fireEvent, screen } from "@testing-library/react";
import TextEditor from ".";
import { createRef } from "react";
import React from "react";

describe("TextEditor 컴포넌트", () => {
  test("렌더링 확인", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<TextEditor ref={ref} />);
    const editor = container.querySelector(".editor");
    expect(editor).toBeInTheDocument();
  });

  test("Bold 버튼 클릭 시 굵은 스타일 적용", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TextEditor ref={ref} />);
    const editor = container.querySelector(".editor");
    if (!editor) throw new Error("Editor not found");
    fireEvent.focus(editor);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    const boldButton = screen.getByRole("button", { name: "Bold" });

    // 에디터에 텍스트 입력
    if (ref.current) {
      ref.current.innerHTML = "Hello World";
    }

    // 텍스트 선택
    const range = document.createRange();
    range.selectNodeContents(editor.firstChild as Node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Bold 버튼 클릭
    fireEvent.click(boldButton);

    // 스타일이 적용되었는지 확인
    expect(ref.current?.innerHTML).toContain('<span class="font-bold">Hello World</span>');
  });

  test("Insert Link 버튼 클릭 시 링크 삽입", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TextEditor ref={ref} />);
    const editor = container.querySelector(".editor");
    if (!editor) throw new Error("Editor not found");
    fireEvent.focus(editor);
    expect(screen.getByRole("button", { name: "Insert Link" })).toBeInTheDocument();
    const insertLinkButton = screen.getByRole("button", { name: "Insert Link" });

    // 에디터에 텍스트 입력
    if (ref.current) {
      ref.current.innerHTML = "Click me";
    }

    // 텍스트 선택
    const range = document.createRange();
    range.selectNodeContents(editor.firstChild as Node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    // 프롬프트 모의 응답 설정
    jest.spyOn(window, "prompt").mockReturnValue("https://example.com");

    // 링크 버튼 클릭
    fireEvent.click(insertLinkButton);

    // 링크가 올바르게 삽입되었는지 확인
    expect(ref.current?.innerHTML).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">Click me</a>');
  });

  test("포커스 및 블러 이벤트 처리", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TextEditor ref={ref} />);
    const editor = container.querySelector(".editor");
    if (!editor) throw new Error("Editor not found");
    fireEvent.focus(editor);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();

    // 포커스 이벤트 발생
    fireEvent.focus(editor);
    const focusSpan = container.querySelector('span.scale-x-100');
    expect(focusSpan).toBeInTheDocument(); // 포커스 시 스타일 적용 확인

    // 블러 이벤트 발생
    fireEvent.blur(editor);
    const blurSpan = container.querySelector('span.scale-x-0');
    expect(blurSpan).toBeInTheDocument();  // 블러 시 스타일 해제 확인
  });
});