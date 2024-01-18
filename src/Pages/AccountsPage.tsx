import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Account } from '../Types/Account';
import { PaginationComponent } from '../Components/Pagination';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StyledLink } from '../Components/StyledLink';
import cn from 'classnames';

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

  const handleSort = () => {
    if (sortColumn === '') {
      return originalAccounts;
    }

    const copy = [...originalAccounts];

    return copy.sort((a, b) => {
      switch (sortColumn) {
        case "accountId":
          return sortOrder === 'desc' ? +b.accountId - +a.accountId : +a.accountId - +b.accountId;
        case "authToken":
        case "email":
        case "creationDate":
          return sortOrder === 'desc' 
          ? b[sortColumn].toString().localeCompare(a[sortColumn].toString()) 
          : a[sortColumn].toString().localeCompare(b[sortColumn].toString())
        default:
          return 1;
      }
    })
  };

  const sortedAccounts = handleSort();

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
            <th 
              role='button' 
              onClick={() => {
                setSortColumn('accountId');
                setSortOrder('asc');
                
                if (sortColumn === 'accountId' && sortOrder === 'asc') {
                  setSortOrder('desc');
                }

                if ((sortColumn === 'accountId' && sortOrder === 'desc')) {
                  setSortOrder('');
                  setSortColumn('');
                }
              }}
              
            >
              ID
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'accountId' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'accountId' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button' 
              onClick={() => {
                setSortColumn('email');
                setSortOrder('asc');
                
                if (sortColumn === 'email' && sortOrder === 'asc') {
                  setSortOrder('desc');
                }

                if ((sortColumn === 'email' && sortOrder === 'desc')) {
                  setSortOrder('');
                  setSortColumn('');
                }
              }}
            >
              Email
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn ===  'email' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn ===  'email' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button' 
              onClick={() => {
                setSortColumn('authToken');
                setSortOrder('asc');
                
                if (sortColumn === 'authToken' && sortOrder === 'asc') {
                  setSortOrder('desc');
                }

                if ((sortColumn === 'authToken' && sortOrder === 'desc')) {
                  setSortOrder('');
                  setSortColumn('');
                }
              }}
            >
              Auth Token
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn ===  'authToken' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn ===  'authToken' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button' 
              onClick={() => {
                setSortColumn('creationDate');
                setSortOrder('asc');
                
                if (sortColumn === 'creationDate' && sortOrder === 'asc') {
                  setSortOrder('desc');
                }

                if ((sortColumn === 'creationDate' && sortOrder === 'desc')) {
                  setSortOrder('');
                  setSortColumn('');
                }
              }}
            >
              Creation Date
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn ===  'creationDate' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn ===  'creationDate' && sortOrder === 'desc')
                })}
              >

              </i>
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
        </>
      )
    }
    </div>
  );
};

export default AccountsPage;
