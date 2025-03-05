import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QuestionItemType } from "@/type";
import QuestionList from ".";

const mockQuestions: QuestionItemType[] = [
  { id: "1", question: "첫 번째 질문", type: "text", required: false, options: [] },
  { 
    id: "2", 
    question: "두 번째 질문", 
    type: "radio", 
    required: true, 
    options: [
      { id: "opt1", content: "Yes" },
      { id: "opt2", content: "No" }
    ] 
  },
];

describe("QuestionList", () => {
  test("초기 질문 리스트를 렌더링해야 한다", () => {
    render(<QuestionList initialItems={mockQuestions} />);
    
    expect(screen.getByText("첫 번째 질문")).toBeInTheDocument();
    expect(screen.getByText("두 번째 질문")).toBeInTheDocument();
  });

  test("드래그 이벤트 시 handleDragStart가 호출되는지 확인", () => {
    render(<QuestionList initialItems={mockQuestions} />);
    
    const firstItem = screen.getByText("첫 번째 질문").closest("li");
    expect(firstItem).not.toBeNull();

    if (firstItem) {
      fireEvent.dragStart(firstItem);
    }
  });

  test("각 질문이 QuestionItem으로 렌더링되는지 확인", () => {
    render(<QuestionList initialItems={mockQuestions} />);
    
    const questionItems = screen.getAllByText(/질문/);
    expect(questionItems.length).toBe(mockQuestions.length);
  });

  test("드래그 후 새로운 순서로 정렬되는지 확인", async () => {
    const { getByText, container } = render(<QuestionList initialItems={mockQuestions} />);
    
    // 초기 질문 순서 확인
    const initialOrder = container.querySelectorAll("ul > li");
    expect(initialOrder[0]).toHaveTextContent("첫 번째 질문");
    expect(initialOrder[1]).toHaveTextContent("두 번째 질문");

    const firstItem = getByText("첫 번째 질문").closest("li");
    const secondItem = getByText("두 번째 질문").closest("li");

    const firstDragButton = firstItem?.querySelector(".move-question");
    const secondDragButton = secondItem?.querySelector(".move-question");

    if (firstDragButton && secondDragButton && firstItem && secondItem) {
      // 드래그 이벤트 시뮬레이션
      fireEvent.dragStart(firstDragButton);
      fireEvent.dragOver(secondItem);
      fireEvent.dragEnter(secondItem);
      fireEvent.drop(secondItem);
      fireEvent.dragEnd(firstDragButton);

      // DOM 업데이트 기다리기
      await waitFor(() => {
        // 업데이트된 순서 다시 쿼리
        const newOrder = container.querySelectorAll("ul > li");
        expect(newOrder[0]).toHaveTextContent("두 번째 질문");
      });
    }
  });
  //질문 삭제
  test("질문 삭제 시 해당 질문이 삭제되는지 확인", () => {
    render(<QuestionList initialItems={mockQuestions} />);
    const deleteButtons = screen.getAllByRole("button", { name: "질문 삭제" });
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText("첫 번째 질문")).not.toBeInTheDocument();
    expect(screen.getByText("두 번째 질문")).toBeInTheDocument();
  });
});