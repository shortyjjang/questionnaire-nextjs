export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    // 저장 실패 시 사용자에게 알림
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      alert("로컬 스토리지 용량이 초과되었습니다. 일부 데이터를 정리해주세요.");
    } else {
      alert("저장 중 오류가 발생했습니다.");
    }
    console.error("로컬스토리지 저장 오류:", error);
    return false;
  }
};
