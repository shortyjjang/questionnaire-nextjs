import React, { useState } from "react";
import { useDetailProvider } from "@/features/Detail";
import { useRouter } from "next/navigation";
import Button from "@/entities/Button";
import { twMerge } from "tailwind-merge";
import { saveToLocalStorage } from "@/lib/saveToLocalStorage";
export default function DetailHeader() {
  const router = useRouter();
  const { template, setIsEditMode, isEditMode } = useDetailProvider();
  const [isOpenMore, setIsOpenMore] = useState(false);

  // 저장
  const handleSave = () => {
    //유효성검사
    if(template.title === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if(template.questions.length === 0) {
      alert("질문을 추가해주세요.");
      return;
    }
    if(template.questions.some((question) => question.question === "")) {
      alert("질문을 입력해주세요.");
      return;
    }
    if(template.questions.some((question) => (question.type === "radio" || question.type === "checkbox") && question.options.length === 0 ? true : false)) {
      alert("옵션을 추가해주세요.");
      return;
    }
    const localTemplates = JSON.parse(
      localStorage.getItem("templates") || "[]"
    );
    const updatedTemplate =
      localTemplates.findIndex((t: any) => t.id === template.id) === -1
        ? {
            id: template.id,
            title: template.title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : {
            ...localTemplates.find((t: any) => t.id === template.id),
            updatedAt: new Date().toISOString(),
          };
    const newTemplates =
      localTemplates.findIndex((t: any) => t.id === template.id) === -1
        ? [...localTemplates, updatedTemplate]
        : localTemplates.map((t: any) =>
            t.id === template.id ? updatedTemplate : t
          );
    if (saveToLocalStorage("templates", newTemplates)) {
      saveToLocalStorage("template" + template.id, template);
    }

    router.push("/");
  };

  // 삭제
  const handleDelete = () => {
    if (!confirm("삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.")) return;
    const localTemplates = JSON.parse(
      localStorage.getItem("templates") || "[]"
    );
    if (saveToLocalStorage("templates", localTemplates.filter((t: any) => t.id !== template.id))) {
      localStorage.removeItem("template" + template.id);
      router.push("/");
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center gap-4 max-w-screen-lg mx-auto px-4">
        <h1 className="text-2xl font-bold whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: template.title }} />
        {isEditMode ?<div className="flex gap-4 items-center md:flex-row-reverse">
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
            >
              저장
            </Button>
            <Button
              onClick={() => {
                if(confirm("정말 취소하시겠습니까?\n변경사항이 저장되지 않습니다.")) {
                  router.push("/");
                }
              }}
            >
              취소
            </Button>
          </div>
          <div
            className={twMerge(
              "flex flex-col gap-2 absolute right-0 bg-white rounded-md p-2 shadow-md border border-gray-200 mt-1 lg:mt-0 lg:p-0 lg:border-0 lg:shadow-none top-full lg:static lg:flex-row",
              isOpenMore ? "opacity-100" : "opacity-0 md:opacity-100"
            )}
          >
            <Button onClick={() => setIsEditMode(false)}>미리보기</Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
          <button
            onClick={() => setIsOpenMore(!isOpenMore)}
            className="md:hidden flex flex-col gap-0.5 cursor-pointer"
            aria-label="더보기"
          >
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          </button>
        </div> : <Button onClick={() => setIsEditMode(true)}>편집모드로 돌아가기</Button>}
      </div>
    </div>
  );
}
