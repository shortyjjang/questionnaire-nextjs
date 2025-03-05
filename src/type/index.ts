export type QuestionOption = {
  id: string;
  content: string;
};

export type QuestionItemType = {
  question: string;
  description?: string;
  options: QuestionOption[];
  required: boolean;
  id: string;
  type: QuestionType;
  answer?: string;
};

export type QuestionType =
  | "text"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea";

export type QuestionTemplate = {
  title: string;
  description: string;
  questions: QuestionItemType[];
  id: string;
};

export type QuestionListType = {
  title: string;
  description: string;
  id: string;
  updatedAt: string;
  createdAt: string;
};
