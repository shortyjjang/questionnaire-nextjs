// 디바운스 타이머를 저장할 객체
const debounceTimers: Record<string, NodeJS.Timeout> = {};
const DEFAULT_DEBOUNCE_DELAY = 1000; // 기본 디바운스 딜레이 (1초)

// 디바운스 처리된 로컬 스토리지 저장 함수
export const saveToLocalStorage = (key: string, data: any, delay = DEFAULT_DEBOUNCE_DELAY) => {
  try {
    // 이미 실행 중인 타이머가 있으면 취소
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key]);
    }

    // 새로운 타이머 설정
    debounceTimers[key] = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        // 타이머 참조 제거
        delete debounceTimers[key];
      } catch (error) {
        // 저장 실패 시 사용자에게 알림
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          alert("로컬 스토리지 용량이 초과되었습니다. 일부 데이터를 정리해주세요.");
        } else {
          alert("저장 중 오류가 발생했습니다.");
        }
        delete debounceTimers[key];
        return false;
      }
    }, delay);

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("디바운스 설정 중 오류:", error);
    }
    return false;
  }
};

// 즉시 저장이 필요한 경우를 위한 함수 (디바운스 없음)
export const saveToLocalStorageImmediately = (key: string, data: any) => {
  try {
    // 진행 중인 디바운스 타이머가 있다면 취소
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key]);
      delete debounceTimers[key];
    }
    
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    // 저장 실패 시 사용자에게 알림
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      alert("로컬 스토리지 용량이 초과되었습니다. 일부 데이터를 정리해주세요.");
    } else {
      alert("저장 중 오류가 발생했습니다.");
    }
    if (process.env.NODE_ENV === "development") {
      console.error("로컬스토리지 저장 오류:", error);
    }
    return false;
  }
};
