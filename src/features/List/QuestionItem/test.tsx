import { render, screen, fireEvent } from "@testing-library/react";
import QuestionItem from "../QuestionItem";
import { QuestionListType } from "@/type";

// push 함수 접근을 위한 참조 생성
const push = jest.fn();

// Next.js router 모킹
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

const mockTemplate: QuestionListType = {
  id: "1",
  title: "설문지 1",
  createdAt: "2025-03-01T12:00:00",
  updatedAt: "2025-03-02T15:00:00",
  description: "설문지 1 설명",
};

describe("QuestionItem", () => {

  const onDelete: jest.Mock = jest.fn();

  it("제목, 생성일, 수정일이 올바르게 표시되는지 확인", () => {
    render(<QuestionItem template={mockTemplate} onDelete={onDelete} />);

    expect(screen.getByText("설문지 1")).toBeInTheDocument();
    expect(screen.getByText("생성일: 2025-03-01 12:00:00")).toBeInTheDocument();
    expect(screen.getByText("마지막 수정일: 2025-03-02 15:00:00")).toBeInTheDocument();
  });

  it("참여하기 버튼 클릭 시 페이지 이동이 정상적으로 호출되는지 확인", () => {
    render(<QuestionItem template={mockTemplate} onDelete={onDelete} />);

    const participateButton = screen.getByText("참여하기");
    fireEvent.click(participateButton);

    expect(push).toHaveBeenCalledWith("/1", { scroll: false });
  });

  it("수정 버튼 클릭 시 페이지 이동이 정상적으로 호출되는지 확인", () => {
    render(<QuestionItem template={mockTemplate} onDelete={onDelete} />);

    const editButton = screen.getByText("수정");
    fireEvent.click(editButton);

    expect(push).toHaveBeenCalledWith("/editor/1", { scroll: false });
  });

  it("삭제 버튼 클릭 시 onDelete가 호출되는지 확인", () => {
    render(<QuestionItem template={mockTemplate} onDelete={onDelete} />);

    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});