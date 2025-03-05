import { saveToLocalStorageImmediately } from '@/lib/saveToLocalStorage';
import { QuestionListType } from '@/type';
import React from 'react'
import QuestionItem from '../QuestionItem';

export default function QuestionList({
  templates,
  setTemplates,
  filteredTemplates,
}: {
  templates: QuestionListType[];
  setTemplates: React.Dispatch<React.SetStateAction<QuestionListType[]>>;
  filteredTemplates: QuestionListType[];
}) {

  //삭제
  const handleDeleteTemplate = (id: string) => {
    if (!confirm("삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.")) return;
    const newTemplates = templates.filter((t) => t.id !== id);
    if (saveToLocalStorageImmediately("templates", newTemplates)) {
      localStorage.removeItem("template" + id);
      setTemplates(newTemplates);
    }
  };
  return (
    <div className="mt-4 flex flex-col gap-4 mx-auto max-w-screen-lg">
      {templates.length > 0 ? (
        filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <QuestionItem
              key={template.id}
              template={template}
              onDelete={() => handleDeleteTemplate(template.id)}
            />
          ))
        ) : (
          <div className="py-5 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )
      ) : (
        <div className="py-5 text-center text-gray-500">
          설문지가 없습니다.
        </div>
      )}
    </div>
  )
}
