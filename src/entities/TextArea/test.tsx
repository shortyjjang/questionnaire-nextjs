import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextArea from '.';

describe('TextArea 컴포넌트 테스트', () => {

  test('textarea이 정상적으로 렌더링되는지 확인', () => {
    render(<TextArea value="test" readOnly />);
    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement).toHaveValue("test");
  });

  test('textarea 포커스 시 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<TextArea value="test" readOnly />);
    const textareaElement = screen.getByRole("textbox");
    fireEvent.focus(textareaElement);
    const checkedSpan = container.querySelector('span.scale-x-100');
    expect(checkedSpan).toBeInTheDocument();
  });

  test('textarea 블러 시 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<TextArea value="test" readOnly />);
    const textareaElement = screen.getByRole("textbox");
    fireEvent.blur(textareaElement);
    const checkedSpan = container.querySelector('span.scale-x-0');
    expect(checkedSpan).toBeInTheDocument();
  });
  test('textarea 크기 조절 테스트', () => {
    render(<TextArea value="test" size="small" readOnly />);
    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toHaveClass("text-sm");
  });
  test('textarea onChange 이벤트 테스트', () => {
    const handleChange = jest.fn();
    render(<TextArea value="test" onChange={handleChange} />);
    const textareaElement = screen.getByRole("textbox");
    fireEvent.change(textareaElement, { target: { value: "test2" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
