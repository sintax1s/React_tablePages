import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Profile } from '../Types/Profile';
import { PaginationComponent } from '../Components/Pagination';
import { StyledLink } from '../Components/StyledLink';
import { handleClick } from '../utils/handleClick'; 
import cn from 'classnames';

const ProfilesPage: React.FC = () => {
  const { AccountId } = useParams();

  const [originalProfiles, setOriginalProfiles] = useState<Profile[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a7c79694c2c5762da788d5.mockapi.io/Accounts/ProfileId')
      .then((data) => {
        const profiles = data.data.filter((profile: Profile) => profile.accountId === AccountId);

        setOriginalProfiles(profiles);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
  }, [AccountId]);

  const handleSort = () => {
    if (sortColumn === '') {
      return originalProfiles;
    }

    const copy = [...originalProfiles];

    return copy.sort((a, b) => {
      switch (sortColumn) {
        case "profileID":
          return sortOrder === 'desc' ? +b.profileID - +a.profileID : +a.profileID - +b.profileID;
        case "marketplace":
        case "country":
          return sortOrder === 'desc' 
          ? b[sortColumn].toString().localeCompare(a[sortColumn].toString()) 
          : a[sortColumn].toString().localeCompare(b[sortColumn].toString())
        default:
          return 1;
      }
    })
  };

  const sortedProfiles = handleSort()

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const filteredProfiles = sortedProfiles.filter(profile =>
    profile.country.toLowerCase().includes(filterValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Profiles</h1>
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
          <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="#">Accounts</a></li>
        <li className="breadcrumb-item active" aria-current="page">Profiles</li>
      </ol>
    </nav>

      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">Filter by Country</label>
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
              onClick={() => handleClick('profileID', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              ID
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'profileID' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'profileID' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button'
              onClick={() => handleClick('country', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              Country
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'country' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'country' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button'
              onClick={() => handleClick('marketplace', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              Marketplace
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'marketplace' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'marketplace' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
          </tr>
        </thead>
          <tbody>

          {paginatedProfiles.map((profile) => (
            <tr key={profile.profileID} >
              <td><StyledLink to={`/Campaigns/${profile.accountId}`}>{profile.profileID}</StyledLink></td>             
              <td><StyledLink to={`/Campaigns/${profile.accountId}`}>{profile.country}</StyledLink></td>
              <td><StyledLink to={`/Campaigns/${profile.accountId}`}>{profile.marketplace}</StyledLink></td>
            </tr>
          ))}
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

export default ProfilesPage;