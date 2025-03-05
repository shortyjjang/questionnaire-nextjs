import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DetailPage from "./page";

// push 함수 접근을 위한 참조 생성
const push = jest.fn();
let id = "1";
// Next.js router 모킹
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
  useParams: () => ({
    id,
  }),
}));

describe("DetailPage 컴포넌트", () => {
  let alertMock: jest.Mock;

  beforeEach(() => {
    alertMock = jest.fn();

    // window.alert 모킹
    window.alert = alertMock;

    // 로컬스토리지 모킹 (템플릿 데이터)
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "template1") {
        return JSON.stringify({
          id: "1",
          title: "설문지 제목",
          questions: [
            {
              id: "q1",
              question: "필수 질문",
              required: true,
              answer: "",
              type: "text",
            },
            {
              id: "q2",
              question: "선택 질문",
              required: false,
              answer: "답변",
              type: "select",
            },
          ],
        });
      }
      return null;
    });
  });

  test("로컬스토리지 데이터를 불러와 정상적으로 렌더링되는지 확인", async () => {
    render(<DetailPage />);

    // 제목이 두 번 렌더링되는지 확인 (헤더와 컨텐츠)
    await waitFor(
      () => {
        expect(screen.getAllByText("설문지 제목")).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    // h3 텍스트로 질문 텍스트 확인 (필수 질문과 선택 질문)
    const requiredQuestion = await screen.findByText("필수 질문");
    const optionalQuestion = await screen.findByText("선택 질문");
    expect(requiredQuestion).toBeInTheDocument();
    expect(optionalQuestion).toBeInTheDocument();

    // 필수 질문 옆에 있는 * 마크 확인 (텍스트 콘텐츠로 확인)
    const starMark = screen.getByText("*");
    expect(starMark).toBeInTheDocument();
  });
  test("필수 질문에 답변하지 않으면 경고창이 뜨는지 확인", async () => {
    render(<DetailPage />);

    // 제목이 두 번 렌더링되는지 확인 (헤더와 컨텐츠)
    await waitFor(
      () => {
        expect(screen.getAllByText("설문지 제목")).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    // 제출 버튼 확인
    const submitButton = screen.getByText("제출");
    expect(submitButton).toBeInTheDocument();

    // 제출 버튼 클릭
    fireEvent.click(submitButton);

    // 경고창 호출 확인
    expect(alertMock).toHaveBeenCalledWith("필수 질문을 답변해주세요.");
  });

  test("제출 버튼 클릭 시 정상적으로 페이지 이동하는지 확인", async () => {
    render(<DetailPage />);

    // 제목이 두 번 렌더링되는지 확인 (헤더와 컨텐츠)
    await waitFor(
      () => {
        expect(screen.getAllByText("설문지 제목")).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    const requiredTextbox = screen.getByRole("textbox", {
      name: "필수 질문",
    });
    fireEvent.change(requiredTextbox, { target: { value: "답변" } });

    // 제출 버튼 확인
    const submitButton = screen.getByText("제출");
    expect(submitButton).toBeInTheDocument();

    // 제출 버튼 클릭
    fireEvent.click(submitButton);

    // 경고창 호출 확인
    expect(alertMock).toHaveBeenCalledWith("제출되었습니다.");
    expect(push).toHaveBeenCalledWith("/");
  });

  test("존재하지 않는 템플릿 ID 입력 시 경고 후 메인 페이지 이동 확인", async () => {
    id = "999";

    render(<DetailPage />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("템플릿을 찾을 수 없습니다.");
      expect(push).toHaveBeenCalledWith("/");
    });
  });
});
