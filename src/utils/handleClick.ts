export const handleClick = (
  sortValue: string,
  setSortOrder: (value: 'asc' | 'desc' | '') => void, 
  setSortColumn: (value: string) => void, 
  sortColumn: string,
  sortOrder: 'asc' | 'desc' | '',
) => {
  setSortColumn(sortValue);
  setSortOrder('asc');
  
  if (sortColumn === sortValue && sortOrder === 'asc') {
    setSortOrder('desc');
  }

  if ((sortColumn === sortValue && sortOrder === 'desc')) {
    setSortOrder('');
    setSortColumn('');
  }
};
