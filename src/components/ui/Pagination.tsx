import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages: number[] = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Anterior
      </Button>

      {getPages().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="w-8 h-8 p-0"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Próxima
      </Button>
    </div>
  )
}
