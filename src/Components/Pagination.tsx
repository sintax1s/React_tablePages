import React from 'react';
import { Pagination } from 'react-bootstrap';

type Props = {
  totalPages: number,
  currentPage: number,
  goToPage: (value: number) => void,
}

export const PaginationComponent: React.FC<Props> = ({
  totalPages,
  currentPage,
  goToPage,
}) => {
  return (
    <Pagination>
    {[...Array(totalPages).keys()].map((page) => (
      <Pagination.Item
        key={page + 1}
        active={currentPage === page + 1}
        onClick={() => goToPage(page + 1)}
      >
        {page + 1}
      </Pagination.Item>
    ))}
  </Pagination>
  )
}
