import { render, screen, fireEvent } from "@testing-library/react";
import { QuestionTemplate } from "@/type";
import QuestionViewer from ".";

const mockTemplate: QuestionTemplate = {
  id: "1",
  title: "테스트 설문지",
  description: "설문지 설명입니다.",
  questions: [
    {
      id: "q1",
      question: "텍스트 질문",
      type: "text",
      required: true,
      options: [],
      answer: "",
    },
    {
      id: "q2",
      question: "텍스트 영역 질문",
      type: "textarea",
      required: false,
      options: [],
      answer: "",
    },
    {
      id: "q3",
      question: "선택 질문",
      type: "select",
      required: false,
      options: [
        { id: "opt1", content: "옵션 1" },
        { id: "opt2", content: "옵션 2" },
      ],
      answer: "opt1",
    },
    {
      id: "q4",
      question: "라디오 질문",
      type: "radio",
      required: false,
      options: [
        { id: "opt1", content: "옵션 A" },
        { id: "opt2", content: "옵션 B" },
      ],
      answer: "opt1",
    },
    {
      id: "q5",
      question: "체크박스 질문",
      type: "checkbox",
      required: false,
      options: [
        { id: "opt1", content: "체크 1" },
        { id: "opt2", content: "체크 2" },
      ],
      answer: "",
    },
  ],
};

describe("QuestionViewer", () => {
  let setTemplate: jest.Mock;

  beforeEach(() => {
    setTemplate = jest.fn();
  });

  it("제목과 설명을 렌더링해야 한다", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);
    
    expect(screen.getByText("테스트 설문지")).toBeInTheDocument();
    expect(screen.getByText("설문지 설명입니다.")).toBeInTheDocument();
  });

  it("각 질문이 올바르게 렌더링되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);

    expect(screen.getByText("텍스트 질문")).toBeInTheDocument();
    expect(screen.getByText("텍스트 영역 질문")).toBeInTheDocument();
    expect(screen.getByText("선택 질문")).toBeInTheDocument();
    expect(screen.getByText("라디오 질문")).toBeInTheDocument();
    expect(screen.getByText("체크박스 질문")).toBeInTheDocument();
  });

  it("필수 질문 표시(*)가 렌더링되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);
    
    const requiredMark = screen.getByText("*");
    expect(requiredMark).toBeInTheDocument();
    expect(requiredMark.tagName.toLowerCase()).toBe("span");
    expect(requiredMark.className).toContain("text-red-500");
  });

  it("텍스트 입력 시 setTemplate이 호출되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);
    
    const input = screen.getByPlaceholderText("답변을 입력해주세요.");
    fireEvent.change(input, { target: { value: "새로운 답변" } });

    expect(setTemplate).toHaveBeenCalled();
  });

  it("드롭다운 선택 시 setTemplate이 호출되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);
    
    const select = screen.getByText("옵션 1");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("옵션 2"));

    expect(setTemplate).toHaveBeenCalled();
  });

  it("라디오 버튼 선택 시 setTemplate이 호출되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);

    expect(screen.getByText("옵션 A")).toBeInTheDocument();
    expect(screen.getByText("옵션 B")).toBeInTheDocument();
    
    const radio = screen.getByText("옵션 B");
    fireEvent.click(radio);

    expect(setTemplate).toHaveBeenCalled();
  });

  it("체크박스 선택 시 setTemplate이 호출되는지 확인", () => {
    render(<QuestionViewer template={mockTemplate} setTemplate={setTemplate} />);
    
    const checkbox = screen.getByDisplayValue("opt1");
    fireEvent.click(checkbox);

    expect(setTemplate).toHaveBeenCalled();
  });
});