import { render, screen, fireEvent } from "@testing-library/react";
import { QuestionListType } from "@/type";
import QuestionList from ".";

// Next.js router 모킹
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockTemplates: QuestionListType[] = [
  {
    id: "1",
    title: "설문지 1",
    createdAt: "2025-03-01T12:00:00",
    updatedAt: "2025-03-02T15:00:00",
    description: "",
  },
];

describe("QuestionList", () => {
  let setTemplates: jest.Mock;

  beforeEach(() => {
    setTemplates = jest.fn();
  });

  it("검색된 템플릿이 있을 때 QuestionItem이 정상 렌더링되는지 확인", () => {
    render(
      <QuestionList
        templates={mockTemplates}
        setTemplates={setTemplates}
        filteredTemplates={mockTemplates}
      />
    );

    expect(screen.getByText("설문지 1")).toBeInTheDocument();
  });

  it("검색 결과가 없을 때 메시지를 표시하는지 확인", () => {
    render(
      <QuestionList
        templates={mockTemplates}
        setTemplates={setTemplates}
        filteredTemplates={[]}
      />
    );

    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("설문지가 없을 때 메시지를 표시하는지 확인", () => {
    render(
      <QuestionList
        templates={[]}
        setTemplates={setTemplates}
        filteredTemplates={[]}
      />
    );

    expect(screen.getByText("설문지가 없습니다.")).toBeInTheDocument();
  });

  it("삭제 버튼 클릭 시 handleDeleteTemplate이 호출되는지 확인", () => {
    window.confirm = jest.fn(() => true);
    render(
      <QuestionList
        templates={mockTemplates}
        setTemplates={setTemplates}
        filteredTemplates={mockTemplates}
      />
    );

    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(setTemplates).toHaveBeenCalled();
  });
});
