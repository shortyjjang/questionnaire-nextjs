"use client";
import Button from "@/entities/Button";
import { QuestionTemplate } from "@/type";
import React, { useCallback, useEffect, useState } from "react";
import DetailViewer from "@/features/Detail/Viewer";
import { useParams, useRouter } from "next/navigation";
// Lazy Loading으로 로컬스토리지 데이터 불러오기
const getLocalTemplates = async (id: string) => {
  return new Promise<QuestionTemplate>((resolve, reject) => {
    setTimeout(() => {
      if(localStorage.getItem("template" + id)) {
        const localTemplates = JSON.parse(
          localStorage.getItem("template" + id) || ""
        );
        resolve(localTemplates);
      } else {
        reject(new Error("Template not found"));
      }
    }, 0); // 비동기 처리로 렌더링 차단 방지
  });
};

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<QuestionTemplate>(
    {} as QuestionTemplate
  );

  const handleSubmit = useCallback(() => {
    if((template.questions || []).length === 0) return;
    if(template.questions.some((question) => question.required && !question.answer)) {
      alert("필수 질문을 답변해주세요.");
      return;
    }
    alert("제출되었습니다.");
    router.push("/");
  }, [template, router]);

  // Lazy Loading으로 로컬스토리지 데이터 가져오기
  useEffect(() => {
    if(id) {
      getLocalTemplates(id.toString()).then(setTemplate).catch(() => {
        alert("템플릿을 찾을 수 없습니다.");
        router.push("/");
      });
    }
  }, [id, router]);
  return (
    <>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-2">
        <div className="flex justify-between items-center gap-4 max-w-screen-lg mx-auto px-4">
          <h1 className="text-2xl font-bold whitespace-pre-wrap line-clamp-1" dangerouslySetInnerHTML={{ __html: template.title }} />
          <Button variant="primary" onClick={handleSubmit} aria-label="제출">제출</Button>
        </div>
      </div>
      <DetailViewer template={template} setTemplate={setTemplate} />
    </>
  );
}
