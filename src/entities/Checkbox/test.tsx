import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '.';

describe('Checkbox 컴포넌트 테스트', () => {
  const label = '테스트 체크박스';

  test('체크박스가 정상적으로 렌더링되는지 확인', () => {
    render(<Checkbox label={label} readOnly />);
    const checkboxElement = screen.getByLabelText(label);
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).not.toBeChecked();
  });

  test('체크박스 클릭 시 이벤트가 정상적으로 호출되는지 확인', () => {
    const handleChange = jest.fn();
    render(<Checkbox label={label} onChange={handleChange} />);
    const checkboxElement = screen.getByLabelText(label);
    fireEvent.click(checkboxElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('체크박스가 checked 상태일 때 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<Checkbox label={label} checked readOnly />);
    const checkedSpan = container.querySelector('span.border-blue-500');
    expect(checkedSpan).toBeInTheDocument();
    const innerCheckedSpan = container.querySelector('span.scale-100');
    expect(innerCheckedSpan).toBeInTheDocument();
  });
});
