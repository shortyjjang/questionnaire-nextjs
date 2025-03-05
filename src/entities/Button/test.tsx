import { render, screen, fireEvent } from "@testing-library/react";
import Button from ".";
import React from "react";

describe("Button Component", () => {
  test("버튼이 렌더링되어야 한다.", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("버튼이 클릭되면 핸들러가 호출되어야 한다.", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("primary 버튼은 파란색 배경과 흰색 텍스트를 가져야 한다.", () => {
    render(<Button variant="primary">Primary</Button>);
    const buttonElement = screen.getByText(/Primary/i);
    
    expect(buttonElement).toHaveClass("bg-blue-500 text-white");
  });

  test("danger 버튼은 빨간색 테두리와 빨간색 텍스트를 가져야 한다.", () => {
    render(<Button variant="danger">Danger</Button>);
    const buttonElement = screen.getByText(/Danger/i);
    
    expect(buttonElement).toHaveClass("border border-red-500 text-red-500");
  });

  test("default 버튼은 회색 테두리와 검정색 텍스트를 가져야 한다.", () => {
    render(<Button variant="default">Default</Button>);
    const buttonElement = screen.getByText(/Default/i);
    
    expect(buttonElement).toHaveClass("border border-gray-300 text-black");
  });
});