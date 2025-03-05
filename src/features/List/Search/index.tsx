import Button from '@/entities/Button'
import Input from '@/entities/Input'
import Select from '@/entities/Select'
import React  from 'react'

export default function Search({
    createdAt,
    keyword,
    setCreatedAt,
    setKeyword,
}: {
    createdAt: string;
    keyword: string;
    setCreatedAt: (createdAt: string) => void;
    setKeyword: (keyword: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={createdAt}
        options={options}
        placeholder="생성일"
        onChange={(value) => setCreatedAt(value)}
      />
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요."
      />
      {(keyword || createdAt !== "all") && <Button variant="default" onClick={() => {
        setCreatedAt("all");
        setKeyword("");
      }}>초기화</Button>}
    </div>
  )
}
const options = [
    {
      label: "전체",
      value: "all",
    },
    {
      label: "최근 7일",
      value: "7",
    },
    {
      label: "최근 30일",
      value: "30",
    },
  ]