import { Account } from "../Types/Account";
import { Campaign } from "../Types/Campaign";
import { Profile } from "../Types/Profile";

type SortableData = Account | Campaign | Profile;

export const handleSort = <T extends SortableData>(
  sortColumn: keyof T,
  sortOrder: string,
  data: T[],
): T[] => {
  if (sortColumn === '') {
    return data;
  }

  const copy = [...data];

  return copy.sort((a, b) => {
    switch (sortColumn) {
      case "campaignId":
      case "cost":
      case "clicks":
      case "accountId":
      case "profileID":
        return sortOrder === 'desc' ? +b[sortColumn] - +a[sortColumn] : +a[sortColumn] - +b[sortColumn];
      case "authToken":
      case "date":
      case "email":
      case "creationDate":
      case "marketplace":
      case "country":
        return sortOrder === 'desc'
          ? (b[sortColumn] as string).localeCompare(a[sortColumn] as string)
          : (a[sortColumn] as string).localeCompare(b[sortColumn] as string);
      default:
        return 1;
    }
  });
};
