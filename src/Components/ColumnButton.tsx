import React from 'react';
import cn from 'classnames';

type props = {
  sortValue: string,
  columnName: string,
  setSortOrder: (value: 'asc' | 'desc' | '') => void, 
  setSortColumn: (value: string) => void, 
  sortColumn: string,
  sortOrder: 'asc' | 'desc' | '',
}

export const ColumnButton: React.FC<props> = ({
  sortValue,
  columnName,
  setSortColumn,
  setSortOrder,
  sortColumn,
  sortOrder,

}) => {
  return (
    <th 
    role='button' 
    onClick={() => {
      setSortColumn(sortValue);
      setSortOrder('asc');
      
      if (sortColumn === sortValue && sortOrder === 'asc') {
        setSortOrder('desc');
      }

      if ((sortColumn === sortValue && sortOrder === 'desc')) {
        setSortOrder('');
        setSortColumn('');
      }
    }}
  >
    {columnName}
    <i className={cn("bi bi-filter", 
      {'bi-sort-down' : (sortColumn ===  sortValue && sortOrder === 'asc'),
        'bi-sort-up' : (sortColumn ===  sortValue && sortOrder === 'desc')
      })}
    >

    </i>
  </th>
  )
}
