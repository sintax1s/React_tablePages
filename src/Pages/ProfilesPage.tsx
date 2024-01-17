import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Profile } from '../Types/Profile';
import { sortData } from '../utils/sortData';
import { PaginationComponent } from '../Components/Pagination';
import { StyledLink } from '../Components/StyledLink';

const ProfilesPage: React.FC = () => {
  const { AccountId } = useParams();

  const [sortedProfiles, setSortedProfiles] = useState<Profile[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a7c79694c2c5762da788d5.mockapi.io/Accounts/ProfileId')
      .then((data) => {
        const profiles = data.data.filter((profile: Profile) => profile.accountId === AccountId);

        setSortedProfiles(profiles);
      })
  }, [AccountId]);

  const handleSort = (columnName: keyof Profile) => {
    sortData<Profile>({
      columnName,
      sortOrder,
      sortedData: sortedProfiles,
      setSortedData: setSortedProfiles,
      setCurrentPage,
    });
  };

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
  console.log(sortOrder);
  return (
    <div>
      <h1>Profiles</h1>
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
            <th onClick={() => {
              sortData<Profile>({
                columnName: 'profileID',
                sortOrder,
                sortedData: sortedProfiles,
                setSortedData: setSortedProfiles,
                setCurrentPage,
              });
              setSortColumn('profileID');

              if (sortColumn === 'profileID' && sortOrder === 'asc') {
                sortData<Profile>({
                  columnName: 'profileID',
                  sortOrder: 'desc',
                  sortedData: sortedProfiles,
                  setSortedData: setSortedProfiles,
                  setCurrentPage,
                });
              } else {
                sortData<Profile>({
                  columnName: 'profileID',
                  sortOrder: 'asc',
                  sortedData: sortedProfiles,
                  setSortedData: setSortedProfiles,
                  setCurrentPage,
                });
              }
            }}>ID</th>
            <th onClick={() => handleSort('country')}>Country</th>
            <th onClick={() => handleSort('marketplace')}>Marketplace</th>
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

      <Button variant="primary">
        На головну
      </Button>
    </div>
  );
};

export default ProfilesPage;