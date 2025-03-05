import { render, fireEvent, screen } from "@testing-library/react";
import Select from ".";
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});
const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

describe("Select Component", () => {
  test("value의 값이 없으면 placeholder가 보여야 한다.", () => {
    render(
      <Select
        options={options}
        placeholder="Select an option"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("value의 값이 있으면 value의 값이 보여야 한다.", () => {
    render(<Select options={options} value="2" onChange={jest.fn()} />);
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("선택하기 버튼을 누르면 드롭다운이 열려야 한다.", () => {
    render(<Select options={options} onChange={jest.fn()} />);
    fireEvent.click(screen.getByText("선택하기"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  test("드롭다운 안의 옵션을 누르면 해당 옵션의 값이 선택되어야 한다.", () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    fireEvent.click(screen.getByText("선택하기"));
    fireEvent.click(screen.getByText("Option 2"));

    expect(handleChange).toHaveBeenCalledWith("2");
  });

  test("드롭다운 안의 옵션을 누르면 드롭다운이 닫혀야 한다.", () => {
    render(<Select options={options} onChange={jest.fn()} />);

    fireEvent.click(screen.getByText("선택하기"));
    fireEvent.click(screen.getByText("Option 1"));

    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  test("키보드 키를 누르면 드롭다운 안의 옵션을 이동할 수 있어야 한다.", () => {
    render(<Select options={options} onChange={jest.fn()} />);
    const selectRef = screen.getByText("선택하기");
    fireEvent.click(selectRef);

    fireEvent.keyDown(selectRef, { key: "ArrowDown" });
    fireEvent.keyDown(selectRef, { key: "ArrowDown" });
    expect(screen.getByText("Option 1")).toHaveClass("bg-gray-200");

    fireEvent.keyDown(selectRef, { key: "ArrowDown" });
    expect(screen.getByText("Option 2")).toHaveClass("bg-gray-200");
  });

  test("엔터 키를 누르면 해당 옵션의 값이 선택되어야 한다.", () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);
    const selectRef = screen.getByText("선택하기");
    fireEvent.click(selectRef);
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    fireEvent.keyDown(selectRef, { key: "ArrowDown" });
    fireEvent.keyDown(selectRef, { key: "ArrowDown" });
    fireEvent.keyDown(selectRef, { key: "Enter" });

    expect(handleChange).toHaveBeenCalledWith("1");
  });
});
