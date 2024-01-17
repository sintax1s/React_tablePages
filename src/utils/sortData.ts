type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface SortOptions<T> {
  columnName: keyof T;
  sortOrder: 'asc' | 'desc';
  sortedData: T[];
  setSortedData: SetStateFunction<T[]>;
  setCurrentPage: SetStateFunction<number>;
}

export const sortData = <T>(options: SortOptions<T>) => {
  const { columnName, sortOrder, sortedData, setSortedData, setCurrentPage } = options;

/*   if (sortOrder === '') {
    setSortedData(sortedData);
    setCurrentPage(1);
    return;
  } */

  const sorted = [...sortedData].sort((a, b) => {
    const columnA = a[columnName];
    const columnB = b[columnName];

    if (columnName === 'accountId' || columnName === 'profileID' || columnName === 'CampaignId') {
      switch (sortOrder) {
        case 'asc':
          return Number(columnA) - Number(columnB);
        case 'desc':
          return Number(columnB) - Number(columnA);
        default:
          return 0;
      }
    }

    switch (sortOrder) {
      case 'asc':
        return String(columnA).localeCompare(String(columnB));
      case 'desc':
        return String(columnB).localeCompare(String(columnA));
      default:
        return 0;
    }
  });

  setSortedData(sorted);
  setCurrentPage(1);
};

