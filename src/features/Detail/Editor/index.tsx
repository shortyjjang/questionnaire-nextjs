"use client";
import React, { useEffect, useRef } from "react";
import TextEditor from "@/entities/TextEditor";
import QuestionList from "./QuesitonList";
import { useDetailProvider } from "@/features/Detail";

export default function QuestionEditor() {
  const { template, setTemplate } = useDetailProvider();
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerHTML = template.title;
    }
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = template.description;
    }
  }, [template]);
  return (
    <div className="flex flex-col gap-4 max-w-screen-lg mx-auto py-4 px-4">
      <div className="bg-white rounded-lg p-4 border-t-4 border-blue-500">
        <TextEditor
          ref={titleRef}
          size="large"
          className="font-bold"
          value={template.title}
          placeholder="설문지 제목"
          onChange={(value) => setTemplate({ ...template, title: value })}
        />
        <TextEditor
          ref={descriptionRef}
          size="small"
          value={template.description}
          placeholder="설문지 설명"
          onChange={(value) => setTemplate({ ...template, description: value })}
        />
      </div>
      <QuestionList initialItems={template.questions} />
    </div>
  );
}
