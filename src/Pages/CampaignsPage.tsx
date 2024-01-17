import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { sortData } from '../utils/sortData';
import { PaginationComponent } from '../Components/Pagination';
import { Campaign } from '../Types/Campaign';

const CampaignsPage: React.FC = () => {
  const { ProfileId } = useParams();

  const [sortedCampaigns, setSortedCampaigns] = useState<Campaign[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    axios.get('https://65a8132c94c2c5762da83c9d.mockapi.io/Campaigns')
      .then((data) => {
        const campaigns = data.data.filter((campaign: Campaign) => campaign.profileId.toString() === ProfileId);

        setSortedCampaigns(campaigns);
      })
  }, [ProfileId]);

  const handleSort = (columnName: keyof Campaign) => {
    sortData<Campaign>({
      columnName,
      sortOrder,
      sortedData: sortedCampaigns,
      setSortedData: setSortedCampaigns,
      setCurrentPage,
    });
  };

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

  return (
    <div>
      <h1>Campaigns</h1>
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
            <th onClick={() => handleSort('campaignId')}>ID</th>
            <th onClick={() => handleSort('clicks')}>Clicks</th>
            <th onClick={() => handleSort('cost')}>Cost</th>
            <th onClick={() => handleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCampaigns.map((campaign) => (
            <tr key={campaign.campaignId} >
              <td>{campaign.campaignId}</td>             
              <td>{campaign.clicks}</td>
              <td>{campaign.cost}</td>
              <td>{campaign.date.toString()}</td>
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

export default CampaignsPage;