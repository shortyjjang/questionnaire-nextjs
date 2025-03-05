import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '.';

describe('Input 컴포넌트 테스트', () => {

  test('input이 정상적으로 렌더링되는지 확인', () => {
    render(<Input value="test" readOnly />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("test");
  });

  test('input 포커스 시 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<Input value="test" readOnly />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.focus(inputElement);
    const checkedSpan = container.querySelector('span.scale-x-100');
    expect(checkedSpan).toBeInTheDocument();
  });

  test('input 블러 시 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<Input value="test" readOnly />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.blur(inputElement);
    const checkedSpan = container.querySelector('span.scale-x-0');
    expect(checkedSpan).toBeInTheDocument();
  });
  test('input 크기 조절 테스트', () => {
    render(<Input value="test" size="small" readOnly />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass("text-sm");
  });
  test('input onChange 이벤트 테스트', () => {
    const handleChange = jest.fn();
    render(<Input value="test" onChange={handleChange} />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "test2" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
