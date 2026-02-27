import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { usePagination } from '../../hooks/usePagination';

type PaginationProps = Omit<ReturnType<typeof usePagination>, 'resetPage'> & {
  totalItems: number;
  itemsPerPage: number;
  tableName: string
  resetPage?: () => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  canGoPrev,
  canGoNext,
  pageNumbers,
  goToPage,
  goToPrev,
  goToNext,
  tableName
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const from = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2">
      <p className="text-sm text-gray-400">
        Mostrando <span className="font-semibold text-gray-600">{from}–{to}</span> de{' '}
        <span className="font-semibold text-gray-600">{totalItems}</span> {tableName}
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={goToPrev}
          disabled={!canGoPrev}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-brand-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) =>
          page === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium border transition-colors ${
                page === currentPage
                  ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-accent'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-brand-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
