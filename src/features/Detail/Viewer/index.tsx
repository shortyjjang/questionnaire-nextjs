import React from "react";
import Input from "@/entities/Input";
import Select from "@/entities/Select";
import TextArea from "@/entities/TextArea";
import Radio from "@/entities/Radio";
import Checkbox from "@/entities/Checkbox";
import { QuestionTemplate } from "@/type";
export default function QuestionViewer({
  template,
  setTemplate,
}: {
  template: QuestionTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<QuestionTemplate>>;
}) {
  return (
    <div className="flex flex-col gap-4 max-w-screen-lg mx-auto p-4">
      <div className="bg-white rounded-lg p-4 border-t-4 border-blue-500 w-full flex flex-col gap-2">
        <h1
          className="text-2xl font-bold whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: template.title }}
        />
        <p
          className="text-sm py-1 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: template.description }}
        />
      </div>
      <ul className="relative flex flex-col gap-2">
        {(template?.questions || []).map((question, qIndex) => (
          <li
            key={question.id}
            className="bg-white rounded-lg p-4 border-t-4 border-blue-500 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <h2
                className="text-lg font-bold whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
              {question.required && (
                <span className="text-red-500" arial-label="필수 질문">
                  *
                </span>
              )}
            </div>
            {question.description && (
              <p
                className="text-sm py-1 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
            )}
            {question.type === "text" && (
              <Input
                value={question?.answer || ""}
                placeholder="답변을 입력해주세요."
                className="w-full"
                onChange={(e) => {
                  setTemplate({
                    ...template,
                    questions: template.questions.map((q, index) =>
                      index === qIndex ? { ...q, answer: e.target.value } : q
                    ),
                  });
                }}
              />
            )}
            {question.type === "textarea" && (
              <TextArea
                value={question?.answer || ""}
                placeholder="답변을 입력해주세요."
                className="w-full"
                onChange={(e) => {
                  setTemplate({
                    ...template,
                    questions: template.questions.map((q, index) =>
                      index === qIndex ? { ...q, answer: e.target.value } : q
                    ),
                  });
                }}
              />
            )}
            {question.type === "select" && (
              <Select
                options={question.options.map((option) => ({
                  label: option.content,
                  value: option.id,
                }))}
                value={question.answer}
                onChange={(value) =>
                  setTemplate({
                    ...template,
                    questions: template.questions.map((q, index) =>
                      index === qIndex ? { ...q, answer: value } : q
                    ),
                  })
                }
              />
            )}
            {(question.type === "radio" || question.type === "checkbox") &&
              question.options.map((option) => (
                <div key={option.id}>
                  {question.type === "radio" ? (
                    <Radio
                      value={question.answer}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          questions: prev.questions.map((q, index) =>
                            index === qIndex
                              ? { ...q, answer: e.target.value }
                              : q
                          ),
                        }))
                      }
                      name={question.id}
                    />
                  ) : (
                    <Checkbox
                      value={question.answer}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          questions: prev.questions.map((q, index) =>
                            index === qIndex
                              ? { ...q, answer: e.target.value }
                              : q
                          ),
                        }))
                      }
                      name={question.id}
                    />
                  )}
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
