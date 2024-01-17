import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Account } from '../Types/Account';
/* import { sortData } from '../utils/sortData'; */
import { PaginationComponent } from '../Components/Pagination';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StyledLink } from '../Components/StyledLink';

const AccountsPage: React.FC = () => {
  const [originalAccounts, setOriginalAccounts] = useState<Account[]>([]);
  const [sortedAccounts, setSortedAccounts] = useState<Account[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc'| 'asc' | ''>('');
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a7c79694c2c5762da788d5.mockapi.io/Accounts/Accounts')
      .then((data) => {
        setOriginalAccounts(data.data);
      })
  }, []);

  const handleSort = (columnName: keyof Account) => {
    const sorted = [...sortedAccounts].sort((a, b) => {
      if (columnName === 'accountId') {
        return sortOrder === 'asc' ? Number(a.accountId) - Number(b.accountId) : Number(b.accountId) - Number(a.accountId);
      }
      return sortOrder === 'asc' ? a[columnName].toString().localeCompare(b[columnName].toString()) : b[columnName].toString().localeCompare(a[columnName].toString());
    });

    setSortedAccounts(sorted);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const filteredAccounts = originalAccounts.filter(account =>
    account.email.toLowerCase().includes(filterValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  console.log(sortOrder, sortColumn)

  return (
    <div>
      <h1>Accounts</h1>
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
            <th 
              role='button' 
              onClick={() => {
                handleSort('accountId');
                setSortColumn(() => 'accountId');


                  if (sortColumn === 'accountId') {
                    setSortOrder(() => 'asc');
                  }
                  
                  if (sortColumn === 'accountId' && sortOrder === 'asc') {
                    setSortOrder(() => 'desc');
                  }
  
                  if ((sortColumn === 'accountId' && sortOrder === 'desc')) {
                    console.log('dwad')
                    setSortOrder(() => '');
                  }


              }}
              
            >
              ID {[sortColumn, sortOrder]}
              <i className="bi bi-sort-down"></i>
            </th>
            <th 
              role='button' 
              onClick={() => {
                setSortColumn('email');
            
                if (sortColumn === 'email' && sortOrder === '') {
                  setSortOrder('asc');
                } else if (sortColumn === 'email' && sortOrder === 'asc') {
                  setSortOrder('desc');
                } else {
                  setSortOrder('');
                }
            
                handleSort('email');
              }}
            >
              Email
              <i className="bi bi-sort-down"></i>
            </th>
            <th 
              role='button' 
              onClick={() => handleSort('authToken')}
            >
              Auth Token
              <i className="bi bi-sort-down"></i>
            </th>
            <th 
              role='button' 
              onClick={() => handleSort('creationDate')}
            >
              Creation Date
              <i className="bi bi-sort-down"></i>
            </th>
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

      <Button variant="primary">
        На головну
      </Button>
    </div>
  );
};

export default AccountsPage;
