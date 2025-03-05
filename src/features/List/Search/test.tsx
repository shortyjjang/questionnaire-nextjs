import { render, screen, fireEvent } from "@testing-library/react";
import Search from "@/features/List/Search";
import React from "react";

describe("Search 컴포넌트 테스트", () => {
  let createdAt = "all";
  let keyword = "";
  const setCreatedAt = jest.fn((value) => (createdAt = value));
  const setKeyword = jest.fn((value) => (keyword = value));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Select와 Input 컴포넌트가 렌더링되어야 한다.", () => {
    render(
      <Search
        createdAt={createdAt}
        keyword={keyword}
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    expect(screen.getByText("전체")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("검색어를 입력하세요.")).toBeInTheDocument();
  });

  it("키워드 입력이 정확하게 업데이트되어야 한다.", () => {
    render(
      <Search
        createdAt={createdAt}
        keyword={keyword}
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    const input = screen.getByPlaceholderText("검색어를 입력하세요.") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "테스트 검색어" } });

    expect(setKeyword).toHaveBeenCalledWith("테스트 검색어");
  });

  it("생성일 선택이 정확하게 업데이트되어야 한다.", () => {
    render(
      <Search
        createdAt={createdAt}
        keyword={keyword}
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    const select = screen.getByText("전체") as HTMLSelectElement;
    fireEvent.click(select);

    expect(screen.getByText("최근 7일")).toBeInTheDocument();
    expect(screen.getByText("최근 30일")).toBeInTheDocument();

    fireEvent.click(screen.getByText("최근 7일"));

    expect(setCreatedAt).toHaveBeenCalledWith("7");
  });

  it("필터가 적용되면 초기화 버튼이 보여야 한다.", () => {
    render(
      <Search
        createdAt="7"
        keyword="테스트"
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    const resetButton = screen.getByRole("button", { name: "초기화" });
    expect(resetButton).toBeInTheDocument();
  });

  it("필터가 적용되지 않으면 초기화 버튼이 보이지 않아야 한다.", () => {
    render(
      <Search
        createdAt="all"
        keyword=""
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    const resetButton = screen.queryByRole("button", { name: "초기화" });
    expect(resetButton).not.toBeInTheDocument();
  });

  it("초기화 버튼이 클릭되면 값이 초기화되어야 한다.", () => {
    render(
      <Search
        createdAt="7"
        keyword="테스트"
        setCreatedAt={setCreatedAt}
        setKeyword={setKeyword}
      />
    );

    const resetButton = screen.getByRole("button", { name: "초기화" });
    fireEvent.click(resetButton);

    expect(setCreatedAt).toHaveBeenCalledWith("all");
    expect(setKeyword).toHaveBeenCalledWith("");
  });
});