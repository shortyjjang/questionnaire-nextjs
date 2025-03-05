import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionList from './OptionList';

const mockItems = [
    {
        id: '1',
        content: '테스트 옵션',
    },
    {
        id: '2',
        content: '테스트 옵션 2',
    },
];

describe('Option 컴포넌트 테스트', () => {
    test('Option 컴포넌트 렌더링 테스트', () => {
        render(<OptionList initialItems={mockItems} type="radio" questionIndex={0} />);
        // 실제 렌더링된 요소 확인
        expect(screen.getByDisplayValue('테스트 옵션')).toBeInTheDocument();
    });
    test('Option 옵션 변경 테스트', () => {
        render(<OptionList initialItems={mockItems} type="radio" questionIndex={0} />);
        // 실제 렌더링된 요소 확인
        expect(screen.getByDisplayValue('테스트 옵션')).toBeInTheDocument();

        //옵션 input 요소 가져오기
        const input = screen.getByDisplayValue('테스트 옵션');

        // 옵션 input 요소에 값 변경
        fireEvent.change(input, { target: { value: '테스트 옵션 변경' } });

        // 변경된 값 확인
        expect(input).toHaveValue('테스트 옵션 변경');
    });
    test('옵션 드래그 위치 변경 테스트', () => {
        const { container } = render(<OptionList initialItems={mockItems} type="radio" questionIndex={0} />);
        
        // 모든 드래그 버튼 가져오기
        const dragButtons = screen.getAllByLabelText("이동");
        const firstDragButton = dragButtons[0];

        // 현재 드래그 전 옵션 순서 확인
        const inputs = screen.getAllByRole('textbox');
        const firstInput = inputs[0];
        const secondInput = inputs[1];
        expect(firstInput).toHaveValue('테스트 옵션 변경');
        expect(secondInput).toHaveValue('테스트 옵션 2');
        
        // 드래그 시작
        fireEvent.dragStart(firstDragButton);
        
        // li 요소들 가져오기
        const listItems = container.querySelectorAll('li');
        
        // 두 번째 li 요소에 드래그 이벤트 발생
        fireEvent.dragOver(listItems[1]);
        fireEvent.dragEnter(listItems[1]);
        
        // 드래그 종료
        fireEvent.dragEnd(firstDragButton);
        
        // 옵션 순서가 변경되었는지 확인
        const updatedInputs = screen.getAllByRole('textbox');
        expect(updatedInputs[0]).toHaveValue('테스트 옵션 2');
        expect(updatedInputs[1]).toHaveValue('테스트 옵션 변경');
    });
    //옵션 삭제
    test('옵션 삭제 테스트', () => {
        render(<OptionList initialItems={mockItems} type="radio" questionIndex={0} />);
        const deleteButtons = screen.getAllByRole("button", { name: "옵션 삭제" });
        fireEvent.click(deleteButtons[0]);
        expect(screen.queryByText('테스트 옵션')).not.toBeInTheDocument();
    });
});
