import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// push 함수 접근을 위한 참조 생성
const push = jest.fn();

// Next.js router 모킹
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("Home 컴포넌트", () => {

  beforeEach(() => {
    // 로컬스토리지 모킹
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify([
        {
          id: "1",
          title: "설문지 1",
          createdAt: "2025-03-01T12:00:00",
          updatedAt: "2025-03-02T15:00:00",
        },
        {
          id: "2",
          title: "설문지 2",
          createdAt: "2025-02-20T10:30:00",
          updatedAt: "2025-02-25T09:00:00",
        },
      ])
    );
  });

  test("로컬스토리지 데이터를 불러오고 렌더링되는지 확인", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("설문지 목록")).toBeInTheDocument();
      expect(screen.getByText("설문지 1")).toBeInTheDocument();
      expect(screen.getByText("설문지 2")).toBeInTheDocument();
    });
  });

  test("검색 기능이 정상적으로 동작하는지 확인", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("설문지 1")).toBeInTheDocument();
      expect(screen.getByText("설문지 2")).toBeInTheDocument();
    });

    // 검색어 입력
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요."); // Search 컴포넌트의 placeholder 가정
    fireEvent.change(searchInput, { target: { value: "설문지 1" } });

    await waitFor(() => {
      expect(screen.getByText("설문지 1")).toBeInTheDocument();
      expect(screen.queryByText("설문지 2")).not.toBeInTheDocument();
    });
  });

  test("날짜 필터 기능이 정상적으로 동작하는지 확인", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("설문지 1")).toBeInTheDocument();
      expect(screen.getByText("설문지 2")).toBeInTheDocument();
    });

    // 날짜 필터 선택 (예: 최근 7일)
    fireEvent.click(screen.getByText("전체"));
    fireEvent.click(screen.getByText("최근 7일"));

    await waitFor(() => {
      expect(screen.getByText("설문지 1")).toBeInTheDocument();
      expect(screen.queryByText("설문지 2")).not.toBeInTheDocument();
    });
  });

  test("새로운 설문지를 추가하면 페이지 이동하는지 확인", () => {
    render(<Home />);

    const addButton = screen.getByText("+ 새로 만들기");
    fireEvent.click(addButton);

    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(expect.stringMatching(/\/editor\/\d+/), {
      scroll: false,
    });
  });
});