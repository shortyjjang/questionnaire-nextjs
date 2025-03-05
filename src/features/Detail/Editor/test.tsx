import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Question from "./index";

const id = new Date().getTime().toString();

// Next.js router 모킹
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Question 컴포넌트 테스트", () => {
  test("Question 컴포넌트 렌더링 테스트", () => {
    render(<Question id={id} />);
    // 실제 렌더링된 요소 확인
    expect(screen.getAllByText("제목없는 설문지").length).toBe(2);
  });
  test("Question 컴포넌트 답변 타입 변경 테스트", async () => {
    render(<Question id={id} />);

    // 답변 타입 변경 하기
    const selectButton = screen.getByText("단답형");
    fireEvent.click(selectButton);

    // 체크박스 옵션 선택
    const checkboxOption = screen.getByText("체크박스");
    fireEvent.click(checkboxOption);

    await waitFor(() => {
      // 체크박스 타입으로 변경되었는지 확인
      const checkboxes = screen.getAllByRole("checkbox");
      // 기존 2개의 체크박스(설명, 필수) + 새로 추가된 체크박스 옵션
      expect(checkboxes.length).toBe(4);
    });
  });

  test("QuestionList 컴포넌트 렌더링 테스트", () => {
    render(<Question id={id} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  
});
