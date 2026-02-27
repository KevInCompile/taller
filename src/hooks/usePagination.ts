import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const offset = (safeCurrentPage - 1) * itemsPerPage;

  const canGoPrev = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < totalPages;

  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];

    const left = Math.max(2, safeCurrentPage - delta);
    const right = Math.min(totalPages - 1, safeCurrentPage + delta);

    range.push(1);

    if (left > 2) range.push(-1); // ellipsis

    for (let i = left; i <= right; i++) range.push(i);

    if (right < totalPages - 1) range.push(-1); // ellipsis

    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [safeCurrentPage, totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    offset,
    itemsPerPage,
    canGoPrev,
    canGoNext,
    pageNumbers,
    goToPage,
    goToPrev,
    goToNext,
    resetPage,
  };
};