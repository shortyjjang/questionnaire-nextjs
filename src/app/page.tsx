"use client";
import Button from "@/entities/Button";
import QuestionList from "@/features/List/QuestionList";
import Search from "@/features/List/Search";
import { QuestionListType } from "@/type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
// Lazy Loading으로 로컬스토리지 데이터 불러오기
const getLocalTemplates = async () => {
  return new Promise<QuestionListType[]>((resolve) => {
    setTimeout(() => {
      const localTemplates = JSON.parse(
        localStorage.getItem("templates") || "[]"
      );
      resolve(localTemplates.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    }, 0); // 비동기 처리로 렌더링 차단 방지
  });
};
export default function Home() {
  const [templates, setTemplates] = useState<QuestionListType[]>([]);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [createdAt, setCreatedAt] = useState("all");

  //검색 필터
  const filterTemplates = useCallback(
    (templates: QuestionListType[]) => {
      return templates.filter((template) =>
        keyword || createdAt !== "all"
          ? (keyword ? template.title.includes(keyword) : true) &&
            (createdAt === "all"
              ? true
              : new Date(template.createdAt).getTime() >
                new Date().getTime() -
                  (createdAt === "7"
                    ? oneWeek
                    : createdAt === "30"
                    ? oneMonth
                    : 0))
          : true
      );
    },
    [createdAt, keyword]
  );

  // 필터링된 결과를 useMemo로 최적화
  const filteredTemplates = useMemo(
    () => filterTemplates(templates),
    [templates, filterTemplates]
  );

  // Lazy Loading으로 로컬스토리지 데이터 가져오기
  useEffect(() => {
    getLocalTemplates().then(setTemplates);
  }, []);
  return (
    <>
      <div className="sticky top-0 left-0 w-full py-4 bg-white">
        <div className="flex items-center justify-between mx-auto max-w-screen-lg">
          <h1 className="text-2xl font-bold">설문지 목록</h1>
          <div className="flex items-center gap-4">
            <Search
              createdAt={createdAt}
              keyword={keyword}
              setCreatedAt={setCreatedAt}
              setKeyword={setKeyword}
            />
            <Button
              variant="primary"
              onClick={() =>
                router.push("/editor/" + new Date().getTime().toString(), {
                  scroll: false,
                })
              }
            >
              + 새로 만들기
            </Button>
          </div>
        </div>
      </div>
      <QuestionList templates={templates} setTemplates={setTemplates} filteredTemplates={filteredTemplates} />
    </>
  );
}

const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;
