import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Account } from '../Types/Account';
import { PaginationComponent } from '../Components/Pagination';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StyledLink } from '../Components/StyledLink';
import { ColumnButton } from '../Components/ColumnButton';
import { handleSort } from '../utils/handleSort';

const ColumnNames = [
  { columnName: 'ID', sortValue: 'accountId'},
  { columnName: 'Email', sortValue: 'email'},
  { columnName: 'Auth Token', sortValue: 'authToken'},
  { columnName: 'Creation Date', sortValue: 'creationDate'},
];

const AccountsPage: React.FC = () => {
  const [originalAccounts, setOriginalAccounts] = useState<Account[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc'| 'asc' | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a7c79694c2c5762da788d5.mockapi.io/Accounts/Accounts')
      .then((data) => {
        setOriginalAccounts(data.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
  }, []);

  const sortedAccounts = handleSort(sortColumn as keyof Account, sortOrder, originalAccounts);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };
  
  const filteredAccounts = sortedAccounts.filter(account =>
    account.email.toLowerCase().includes(filterValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Accounts</h1>
      {isLoading 
      ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      )
      : (
        <>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Filter by Email</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={filterValue}
              onChange={handleFilterChange}
            />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                {ColumnNames.map((column) => (
                  <ColumnButton 
                    sortValue={column.sortValue}
                    columnName={column.columnName}
                    setSortColumn={setSortColumn}
                    setSortOrder={setSortOrder}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                  />
                ))}            
              </tr>
            </thead>
            <tbody>
              {paginatedAccounts.map((account) => {
                const date = new Date(account.creationDate)
                .toString().split(' ').slice(0, 5).join(' ');


                return(
                <tr key={account.accountId}>
                  <td><StyledLink to={`/Profiles/${account.accountId}`}>{account.accountId}</StyledLink></td>
                  <td><StyledLink to={`/Profiles/${account.accountId}`}>{account.email}</StyledLink></td>
                  <td><StyledLink to={`/Profiles/${account.accountId}`}>{account.authToken}</StyledLink></td>
                  <td><StyledLink to={`/Profiles/${account.accountId}`}>{date.toString()}</StyledLink></td>
                </tr>
              )})}
            </tbody>
          </Table>

          <PaginationComponent 
            totalPages={totalPages} 
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </>
      )
    }
    </div>
  );
};

export default AccountsPage;
