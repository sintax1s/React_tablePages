import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { PaginationComponent } from '../Components/Pagination';
import { Campaign } from '../Types/Campaign';
import { ColumnButton } from '../Components/ColumnButton';
import { handleSort } from '../utils/handleSort';

const ColumnNames = [
  { columnName: 'ID', sortValue: 'campaignId'},
  { columnName: 'Clicks', sortValue: 'clicks'},
  { columnName: 'Cost', sortValue: 'cost'},
  { columnName: 'Date', sortValue: 'date'},
];

const CampaignsPage: React.FC = () => {
  const { ProfileId } = useParams();

  const [originalCampaigns, setOriginalCampaigns] = useState<Campaign[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [sortColumn, setSortColumn] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a8132c94c2c5762da83c9d.mockapi.io/Campaigns')
      .then((data) => {
        const campaigns = data.data.filter((campaign: Campaign) => campaign.profileId.toString() === ProfileId);

        setOriginalCampaigns(campaigns);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
  }, [ProfileId]);

  const sortedCampaigns = handleSort(sortColumn as keyof Campaign, sortOrder, originalCampaigns);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const filteredCampaigns = sortedCampaigns.filter(profile =>
    profile.cost.toString().toLowerCase().includes(filterValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>Campaigns</h1>
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
              <li className="breadcrumb-item" onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                <a style={{ color: 'blue', textDecoration: 'underline'}}>Profiles</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Campaigns</li>
            </ol>
          </nav>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Filter by Cost</label>
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
                {ColumnNames.map(column => (
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
              {paginatedCampaigns.map((campaign) => {
                const date = new Date(campaign.date)
                .toString().split(' ').slice(0, 5).join(' ');
              return(
                <tr key={campaign.campaignId} >
                  <td>{campaign.campaignId}</td>             
                  <td>{campaign.clicks}</td>
                  <td>{campaign.cost}</td>
                  <td>{date}</td>
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

export default CampaignsPage;