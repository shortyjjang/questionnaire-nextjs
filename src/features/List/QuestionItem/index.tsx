import Button from "@/entities/Button";
import { QuestionListType } from "@/type";
import { useRouter } from "next/navigation";
import React from "react";

export default function QuestionItem({
  template,
  onDelete,
}: {
  template: QuestionListType;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col bg-white p-4 rounded-md shadow-md lg:flex-row lg:justify-between lg:items-center">
      <div className="flex flex-col">
        <div>{template.title}</div>
        <div className="text-xs text-gray-500">
          마지막 수정일: {template.updatedAt.replace("T", " ").substring(0, 19)}
        </div>
        <div className="text-xs text-gray-500">
          생성일: {template.createdAt.replace("T", " ").substring(0, 19)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push(`/${template.id}`, { scroll: false })}
        >
          참여하기
        </Button>
        <Button
          onClick={() =>
            router.push(`/editor/${template.id}`, { scroll: false })
          }
        >
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(template.id)}>
          삭제
        </Button>
      </div>
    </div>
  );
}
