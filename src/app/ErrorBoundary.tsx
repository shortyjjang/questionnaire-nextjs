"use client";
import React, { ErrorInfo, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // ErrorBoundary에서 캐치한 오류 처리
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary에서 캐치한 오류:", error);
    }

    // 사용자 정의 오류 처리 콜백 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 로컬 스토리지에 오류 로깅
    this.logErrorToStorage(error, errorInfo);
  }
  logErrorToStorage(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorLogs = JSON.parse(localStorage.getItem("errorLogs") || "[]");
      // 동일 에러 타입 집계를 위한 카테고리 추가
      const errorCategory = this.categorizeError(error);

      errorLogs.push({
        timestamp: new Date().toISOString(),
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        category: errorCategory,
        type: "react-component",
      });

      // 로그 크기 제한
      while (errorLogs.length > 20) errorLogs.shift();
      localStorage.setItem("errorLogs", JSON.stringify(errorLogs));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("에러 로깅 실패:", e);
      }
    }
  }

  // 에러 카테고리화 예시
  categorizeError(error: Error): string {
    if (error.message.includes("localStorage")) return "storage";
    if (error.message.includes("fetch") || error.message.includes("network"))
      return "network";
    if (error.message.includes("prop") || error.message.includes("undefined"))
      return "props";
    return "general";
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-700 text-lg font-medium">
            문제가 발생했습니다
          </h2>
          <p className="text-red-500">
            컴포넌트 렌더링 중 오류가 발생했습니다.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => this.setState({ hasError: false })}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 전역 에러 처리를 추가하는 래퍼 컴포넌트
export default function ErrorHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 미처리 오류 처리
    const handleGlobalError = (event: ErrorEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.error("전역 미처리 오류:", event.error);
      }
      logErrorToStorage({
        type: "unhandled-error",
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      });
    };

    // Promise 오류 처리
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.error("미처리 Promise 오류:", event.reason);
      }
      logErrorToStorage({
        type: "unhandled-promise",
        message: event.reason?.message || "알 수 없는 Promise 오류",
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

// 로컬 스토리지에 에러 로깅 유틸리티
function logErrorToStorage(errorData: any) {
  try {
    const errorLogs = JSON.parse(localStorage.getItem("errorLogs") || "[]");
    errorLogs.push(errorData);
    // 로그 크기 제한 (최근 20개만 유지)
    while (errorLogs.length > 20) errorLogs.shift();
    localStorage.setItem("errorLogs", JSON.stringify(errorLogs));

    // 선택적: 사용자에게 에러 알림 표시
    // showErrorNotification(errorData.message);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("에러 로깅 실패:", e);
    }
  }
}
