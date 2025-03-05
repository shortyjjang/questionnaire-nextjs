import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Radio from '.';

describe('Radio 컴포넌트 테스트', () => {
  const label = '테스트 라디오';
  const id = 'test-radio';

  test('라디오 버튼이 정상적으로 렌더링되는지 확인', () => {
    render(<Radio label={label} id={id} readOnly />);
    const radioElement = screen.getByLabelText(label);
    expect(radioElement).toBeInTheDocument();
    expect(radioElement).not.toBeChecked();
  });

  test('라디오 버튼 클릭 시 이벤트가 정상적으로 호출되는지 확인', () => {
    const handleChange = jest.fn();
    render(<Radio label={label} id={id} onChange={handleChange} />);
    const radioElement = screen.getByLabelText(label);
    fireEvent.click(radioElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('라디오 버튼이 checked 상태일 때 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<Radio label={label} id={id} checked readOnly />);
    const checkedSpan = container.querySelector('span.border-blue-500');
    expect(checkedSpan).toBeInTheDocument();
    const innerCheckedSpan = container.querySelector('span.bg-blue-500.scale-100');
    expect(innerCheckedSpan).toBeInTheDocument();
  });
});
