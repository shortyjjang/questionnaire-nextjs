
import useDragging from "@/hooks/useDragging";
import { createContext, useContext, useId } from "react";
import React from "react";
import { useDetailProvider } from "@/features/Detail";
import OptionItem from "../OptionItem";
import { QuestionOption } from "@/type";

type OptionListContextType = {
  handleDragEnter: (e: React.MouseEvent, index: number) => void;
  handleDragEnd: () => void;
  handleDragStart: (index: number) => void;
  handleTouchStart: (e: React.TouchEvent, index: number) => void;
  focusId: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  setItems: React.Dispatch<React.SetStateAction<QuestionOption[]>>;
  type: "select" | "radio" | "checkbox";
  items: QuestionOption[];
};

const OptionListContext = createContext<OptionListContextType>({
  handleDragEnter: () => {},
  handleDragEnd: () => {},
  handleDragStart: () => {},
  handleTouchStart: () => {},
  focusId: "",
  handleChange: () => {},
  setItems: () => {},
  type: "select",
  items: [],
});
export default function OptionList({
  initialItems,
  type,
  questionIndex,
}: {
  initialItems: { id: string; content: string }[];
  type: "select" | "radio" | "checkbox";
  questionIndex: number;
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
  const { setTemplate } = useDetailProvider();

  // 옵션 내용 변경
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newItems = [...items];
    newItems[index].content = e.target.value;
    setItems(newItems);
    setTemplate((prev) => ({ ...prev, questions: prev.questions.map((it, i) => i === questionIndex ? ({
      ...it,
      options: newItems
    }) : it) }));
  };


  return (
    <OptionListContext.Provider
      value={{
        handleDragEnter,
        handleDragEnd,
        handleDragStart,
        handleTouchStart,
        focusId,
        handleChange,
        setItems,
        type,
        items,
      }}
    >
      <ul className="relative" ref={listRef} onTouchEnd={handleTouchEnd}>
        {items.map((item, index) => (
          <li
            key={item.id}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
          >
            <OptionItem
              item={item}
              index={index}
              questionIndex={questionIndex}
            />
          </li>
        ))}
        <li className="flex items-center gap-2">
            <OptionItem
              item={{id: focusId + items.length, content: ""}}
              index={items.length}
              draggable={false}
              questionIndex={questionIndex}
            />
        </li>
      </ul>
    </OptionListContext.Provider>
  );
}

export function useOptionListContext() {
  return useContext(OptionListContext);
}

OptionList.displayName = "OptionList";
