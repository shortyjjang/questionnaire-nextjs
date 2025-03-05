"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { QuestionTemplate } from "@/type";
import QuestionEditor from "./Editor";
import QuestionViewer from "./Viewer";
import DetailHeader from "./DetailHeader";

const initialTemplate: QuestionTemplate = {
  title: "제목없는 설문지",
  description: "",
  questions: [
    {
      question: "",
      description: "",
      type: "text",
      required: false,
      options: [
        {
          id: new Date().getTime().toString(),
          content: "",
        },
      ],
      id: new Date().getTime().toString(),
    },
  ],
  id: new Date().getTime().toString(),
}

// Lazy Loading으로 로컬스토리지 데이터 불러오기
const getLocalTemplates = async (id: string) => {
  return new Promise<QuestionTemplate>((resolve) => {
    setTimeout(() => {
      const localTemplates = localStorage.getItem("template"+id) ? JSON.parse(
        localStorage.getItem("template"+id) || ""
      ) : {
        ...initialTemplate,
        id: id,
        title: "제목없는 설문지",
      };
      resolve(localTemplates);
    }, 0); // 비동기 처리로 렌더링 차단 방지
  });
};

const TemplateContext = createContext<{
  template: QuestionTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<QuestionTemplate>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  template: initialTemplate,
  setTemplate: () => {},
  isEditMode: true,
  setIsEditMode: () => {},
});

export default function Question({ id }: { id?: string }) {
  const [template, setTemplate] = useState<QuestionTemplate>(initialTemplate);
  const [isEditMode, setIsEditMode] = useState(true);
  // Lazy Loading으로 로컬스토리지 데이터 가져오기
  useEffect(() => {
    if (id) {
      getLocalTemplates(id).then(setTemplate);
    }
  }, [id]);

  return (
    <TemplateContext.Provider value={{ template, setTemplate, isEditMode, setIsEditMode }}>
      <DetailHeader />
      {isEditMode ? <QuestionEditor /> : <QuestionViewer template={template} setTemplate={setTemplate} />}
    </TemplateContext.Provider>
  );
}

export function useDetailProvider() {
  return useContext(TemplateContext);
}