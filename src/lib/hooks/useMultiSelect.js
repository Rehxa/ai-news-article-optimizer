import { useState, useRef, useEffect } from "react";
export function useMultiSelect() {
  const [isSelectionState, setIsSelectionState] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const timerRef = useRef(null);

  const handleSelection = (id) => {
    if (!isSelectionState) {
      timerRef.current = setTimeout(() => {
        setIsSelectionState(true);
        setSelectedIds((prev) => new Set(prev).add(id));
      }, 600);
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const cancelLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleSelection = () => {
    if (isSelectionState) {
      setSelectedIds(new Set());
      setIsSelectionState(false);
    } else {
      setIsSelectionState(true);
    }
  };

  const handleSelectAll = (allIds) => {
    if (selectedIds.size === allIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const clear = () => {
    setSelectedIds(new Set());
    setIsSelectionState(false);
  };

  useEffect(() => {
    return () => cancelLongPress();
  }, []);

  return {
    isSelectionState,
    selectedIds,
    handleSelection,
    cancelLongPress,
    toggleSelection,
    handleSelectAll,
    clear,
  };
}
