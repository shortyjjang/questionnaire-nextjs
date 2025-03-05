import React from "react";
import { useOptionListContext } from "../OptionList";
import Input from "@/entities/Input";
import { twMerge } from "tailwind-merge";
import Radio from "@/entities/Radio";
import Checkbox from "@/entities/Checkbox";
import { useDetailProvider } from "@/features/Detail";
export default function OptionItem({
  item,
  index,
  draggable = true,
  questionIndex,
}: {
  item: { id: string; content: string };
  index: number;
  draggable?: boolean;
  questionIndex: number;
}) {
  const { handleDragStart, handleTouchStart, focusId, handleChange, type, setItems, items } =
    useOptionListContext();
  const { setTemplate } = useDetailProvider();
  // 옵션 삭제
  const handleDeleteOption = () => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setTemplate((prev) => ({ ...prev, questions: prev.questions.map((it, i) => i === questionIndex ? ({
      ...it,
      options: newItems
    }) : it) }));
  };
  // 옵션 추가
  const addOption = () => {
    if (!draggable) {
      const lastChild = document.getElementById(focusId + (items.length - 1));
      setItems((prev) => [...prev, { id: focusId + items.length, content: "" }]);
      if (lastChild) {
        lastChild.focus();
      }
    }
  }
  return (
    <div
      className={twMerge(
        "flex items-center gap-2 bg-white group relative px-2 py-1 justify-between"
      )}
    >
      {draggable && (
        <button
          className="absolute right-full top-1/2 -translate-y-1/2 p-1 cursor-grab group-hover:opacity-100 opacity-0"
          draggable={draggable}
          onDragStart={() => handleDragStart(index)}
          onTouchStart={(e) => handleTouchStart(e, index)}
          aria-label="이동"
        >
          <span className="block w-1.5 h-3 border-x-2 border-dotted border-gray-300" />
        </button>
      )}
      {type === "select" && <span>{index + 1}</span>}
      {type === "radio" && <Radio />}
      {type === "checkbox" && <Checkbox />}
      <Input
        className={draggable ? "flex-1" : "w-fit"}
        value={item.content}
        readOnly={!draggable}
        onFocus={addOption}
        id={focusId + index}
        onChange={(e) => handleChange(e, index)}
        placeholder="옵션 추가"
      />
      {draggable && (
        <button aria-label="삭제" className="relative rotate-45 cursor-pointer" onClick={handleDeleteOption}>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-5 bg-gray-500 rounded-xs" />
          <span className="w-5 h-[2px] bg-gray-500 block rounded-xs" />
        </button>
      )}
    </div>
  );
}
