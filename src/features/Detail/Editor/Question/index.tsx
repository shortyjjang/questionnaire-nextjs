"use client";
import useDragging from "@/hooks/useDragging";
import { createContext, useContext, useId } from "react";
import React from "react";
import QuestionItem from "./QuestionItem";
import { QuestionItemType } from "@/type";

type QuestionListContextType = {
  handleDragEnter: (e: React.MouseEvent, index: number) => void;
  handleDragEnd: () => void;
  handleDragStart: (index: number) => void;
  handleTouchStart: (e: React.TouchEvent, index: number) => void;
  focusId: string;
  setItems: React.Dispatch<React.SetStateAction<QuestionItemType[]>>;
};

export const QuestionListContext = createContext<QuestionListContextType>({
  handleDragEnter: () => {},
  handleDragEnd: () => {},
  handleDragStart: () => {},
  handleTouchStart: () => {},
  focusId: "",
  setItems: () => {},
});
export default function QuestionList({
  initialItems,
}: {
  initialItems: QuestionItemType[];
}) {
  const focusId = useId();
  const {
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchEnd,
    listRef,
    items,
    handleDragEnter,
    setItems,
  } = useDragging(initialItems);

  return (
    <QuestionListContext.Provider
      value={{
        handleDragEnter,
        handleDragEnd,
        handleDragStart,
        handleTouchStart,
        focusId,
        setItems,
      }}
    >
      <ul className="relative flex flex-col gap-2" ref={listRef} onTouchEnd={handleTouchEnd}>
        {items.map((item, index) => (
          <li
            key={item.id}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
          >
            <QuestionItem
              item={item}
              index={index}
              totalItems={items.length}
            />
          </li>
        ))}
      </ul>
    </QuestionListContext.Provider>
  );
}

export function useQuestionListContext() {
  return useContext(QuestionListContext);
}

QuestionList.displayName = "QuestionList";
