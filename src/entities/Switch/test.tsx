import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Switch from '.';

describe('Switch 컴포넌트 테스트', () => {
  const label = '테스트 스위치';

  test('스위치가 정상적으로 렌더링되는지 확인', () => {
    render(<Switch label={label} readOnly />);
    const switchElement = screen.getByLabelText(label);
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  test('스위치 클릭 시 이벤트가 정상적으로 호출되는지 확인', () => {
    const handleChange = jest.fn();
    render(<Switch label={label} onChange={handleChange} />);
    const switchElement = screen.getByLabelText(label);
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('스위치가 checked 상태일 때 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<Switch label={label} checked readOnly />);
    const checkedSpan = container.querySelector('span.translate-x-5.bg-blue-500');
    expect(checkedSpan).toBeInTheDocument();
  });
});
