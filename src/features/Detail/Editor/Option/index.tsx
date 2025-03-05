import React from "react";

import Switch from "@/entities/Switch";
import Input from "@/entities/Input";
import OptionList from "./OptionList";
import { QuestionItemType, QuestionOption, QuestionType } from "@/type";
import TextArea from "@/entities/TextArea";
export default function Option({
  type,
  required,
  options,
  index,
  handleUpdateItems,
}: {
  type: QuestionType;
  required: boolean;
  options: QuestionOption[];
  index: number;
  handleUpdateItems: (
    index: number,
    key: keyof QuestionItemType,
    value: QuestionItemType[keyof QuestionItemType]
  ) => void;
}) {
  return (
    <>
      {type === "text" && (
        <Input className="w-full" readOnly placeholder="단답형 텍스트" size="small" />
      )}
      {type === "textarea" && (
        <TextArea className="w-full" readOnly placeholder="장문형 텍스트" size="small" />
      )}
      {(type === "select" ||
        type === "radio" ||
        type === "checkbox") && (
        <OptionList
          initialItems={options}
          type={type}
          questionIndex={index}
        />
      )}
      <div className="flex items-center gap-2 justify-end pt-2">
        <Switch
          checked={required}
          onChange={(e) =>
            handleUpdateItems(index, "required", e.target.checked)
          }
          label="답변 필수여부"
        />
      </div>
    </>
  );
}
