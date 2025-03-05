import Switch from "@/entities/Switch";
import { useEffect, useId, useRef, useState, useCallback, useMemo } from "react";
import TextEditor from "@/entities/TextEditor";
import Select from "@/entities/Select";
import { useQuestionListContext } from "..";
import CopyIcon from "@/assets/icons/CopyIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import { useDetailProvider } from "@/features/Detail/Editor";
import { QuestionItemType, QuestionType } from "@/type";
import Option from "@/features/Detail/Editor/Option";

export default function QuestionItem({
  item,
  index,
  totalItems,
}: {
  item: QuestionItemType;
  index: number;
  totalItems: number;
}) {
  const focusId = useId();
  const questionRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isShowDescription, setIsShowDescription] = useState(false);
  const { handleDragStart, handleTouchStart, setItems } = useQuestionListContext();
  const { setTemplate } = useDetailProvider();

  // 답변 타입 옵션
  const questionTypeOptions = useMemo(
    () => [
      { label: "단답형", value: "text" },
      { label: "장문형", value: "textarea" },
      { label: "드랍다운", value: "select" },
      { label: "라디오", value: "radio" },
      { label: "체크박스", value: "checkbox" },
    ],
    []
  );

  // 질문 수정
  const handleUpdateItems = useCallback(
    (index: number, key: keyof QuestionItemType, value: QuestionItemType[keyof QuestionItemType]) => {
      setItems((items) =>
        items.map((it, i) => (i === index ? { ...it, [key]: value } : it))
      );
      setTemplate((prev) => ({
        ...prev,
        questions: prev.questions.map((it, i) => (i === index ? { ...it, [key]: value } : it)),
      }));
    },
    [setItems, setTemplate]
  );

  // 질문 삭제
  const handleDeleteQuestion = useCallback(() => {
    setItems((items) => items.filter((_, i) => i !== index));
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  }, [setItems, setTemplate, index]);

  // 질문 복사
  const handleCopyQuestion = useCallback(() => {
    const newItem = {
      ...item,
      question: questionRef.current?.innerHTML || "",
      description: descriptionRef.current?.innerHTML || "",
      id: focusId + totalItems,
    };
    setItems((items) => [...items, newItem]);
    setTemplate((prev) => ({
      ...prev,
      questions: [...prev.questions, newItem],
    }));
  }, [item, focusId, setItems, setTemplate, totalItems]);

  const handleShowDescription = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowDescription(e.target.checked);
    if (e.target.checked) {
      setTimeout(() => {
        descriptionRef.current?.focus();
      }, 100);
    }
  }, []);

  // 마운트 시 질문 내용 설정
  useEffect(() => {
    if (questionRef.current) questionRef.current.innerHTML = item.question;
    if (descriptionRef.current) descriptionRef.current.innerHTML = item.description || "";
  }, [item]);

  return (
    <div className="bg-white rounded-lg p-4 focus-within:border-blue-500 focus-within:border-l-4">
      <button
        className="block mx-auto w-fit p-1 cursor-grab move-question"
        draggable={true}
        onDragStart={() => handleDragStart(index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        aria-label="질문 순서 변경"
      >
        <span className="block w-6 h-1.5 border-y-2 border-dotted border-gray-300" />
      </button>
      <div className="flex flex-col lg:flex-row-reverse items-start gap-2">
        <div className="flex items-center gap-2 justify-end w-full lg:w-auto lg:py-1">
          <button
            onClick={handleCopyQuestion}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="질문 복사"
            title="질문 복사"
          >
            <CopyIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleDeleteQuestion}
            aria-label="질문 삭제"
            title="질문 삭제"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <DeleteIcon className="w-6 h-6" />
          </button>
          <Switch checked={isShowDescription} onChange={handleShowDescription} label="설명" />
        </div>
        <div className="flex-1 w-full lg:w-auto flex flex-col lg:flex-row gap-2">
          <TextEditor
            ref={questionRef}
            className="flex-1 font-bold"
            value={item.question}
            onChange={(value) => handleUpdateItems(index, "question", value)}
            placeholder="질문"
          />
          <Select
            value={item.type}
            options={questionTypeOptions}
            aria-label="답변 타입 변경"
            onChange={(value) => handleUpdateItems(index, "type", value as QuestionType)}
          />
        </div>
      </div>
      {isShowDescription && (
        <TextEditor
          ref={descriptionRef}
          onChange={(value) => handleUpdateItems(index, "description", value)}
          placeholder="설명"
          size="small"
          value={item.description}
        />
      )}
      <Option
        type={item.type}
        required={item.required}
        options={item.options}
        index={index}
        handleUpdateItems={handleUpdateItems}
      />
    </div>
  );
}