import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DraggingStyle = {
  position: string;
  top: string;
  left: string;
  right: string;
  zIndex: number;
  pointerEvents: string;
};

export const initialDraggingStyle: DraggingStyle = {
  position: "",
  top: "",
  left: "",
  right: "",
  zIndex: 0,
  pointerEvents: "none",
};

export default function useDragging<T>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const touchStartY = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);

  const [draggingStyle, setDraggingStyle] = useState<DraggingStyle>(initialDraggingStyle);

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
  }, []);

  const handleDragEnter = useCallback((e: React.MouseEvent, index: number) => {
    if (dragItem.current === null) return;
    handleDummyPosition(e.clientY);
    dragOverItem.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    // ref 값을 임시 변수에 저장
    const dragIndex = dragItem.current;
    const dropIndex = dragOverItem.current;
    
    if (dragIndex !== dropIndex) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const itemToMove = newItems[dragIndex];
        
        if (itemToMove) {
          newItems.splice(dragIndex, 1);
          newItems.splice(dropIndex, 0, itemToMove);
        }
        
        return newItems;
      });
    }
    
    // ref 초기화는 상태 업데이트 후에 수행
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingStyle(initialDraggingStyle);
  }, [items]);

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    touchStartY.current = e.touches[0].clientY;
    dragItem.current = index;
  }, []);

  const handleDummyPosition = useCallback((y: number) => {
    if (!listRef.current) return;
    const offsetY = y - listRef.current.getBoundingClientRect().top;
    setDraggingStyle({
      position: "absolute",
      top: `${offsetY}px`,
      left: "0",
      right: "0",
      zIndex: 1000,
      pointerEvents: "none",
    });
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      handleDummyPosition(touchY);

      const deltaY = touchY - touchStartY.current;
      const itemHeight = listRef.current?.children[0].clientHeight || 50;
      const moveIndex =
        dragItem.current !== null
          ? Math.round(dragItem.current + deltaY / itemHeight)
          : null;

      if (moveIndex !== null && moveIndex >= 0 && moveIndex < items.length) {
        dragOverItem.current = moveIndex;
      }
    },
    [handleDummyPosition, items.length]
  );

  const handleTouchEnd = useCallback(() => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const itemToMove = newItems[dragItem.current!];
        
        if (itemToMove && dragItem.current !== dragOverItem.current) {
          newItems.splice(dragItem.current!, 1);
          newItems.splice(dragOverItem.current!, 0, itemToMove);
        }
        
        return newItems;
      });
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingStyle(initialDraggingStyle);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      list.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchMove]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const memoizedDraggingStyle = useMemo(() => draggingStyle, [draggingStyle]);

  return {
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    listRef,
    items,
    setItems,
    handleDragEnter,
    dragItem,
    dragOverItem,
    draggingStyle: memoizedDraggingStyle,
  };
}