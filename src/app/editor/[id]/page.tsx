"use client";
import Question from "@/features/Detail/Editor";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditorPage() {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (id) {
    return <Question id={id as string} />;
  }
  return <div />;
}
