import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { PaginationComponent } from '../Components/Pagination';
import { Campaign } from '../Types/Campaign';
import { handleClick } from '../utils/handleClick';
import cn from 'classnames';

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

  const handleSort = () => {
    if (sortColumn === '') {
      return originalCampaigns;
    }

    const copy = [...originalCampaigns];

    return copy.sort((a, b) => {
      switch (sortColumn) {
        case "accountId":
        case "cost":
        case "clicks":
          return sortOrder === 'desc' ? +b.campaignId - +a.campaignId : +a.campaignId - +b.campaignId;

        case "date":
          return sortOrder === 'desc' 
          ? b[sortColumn].toString().localeCompare(a[sortColumn].toString()) 
          : a[sortColumn].toString().localeCompare(b[sortColumn].toString())
        default:
          return 1;
      }
    })
  };

  const sortedCampaigns = handleSort();

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
            <th 
              role='button'
              onClick={() => handleClick('campaignId', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              ID
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'campaignId' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'campaignId' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button'
              onClick={() => handleClick('clicks', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              Clicks
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'clicks' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'clicks' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button'
              onClick={() => handleClick('cost', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            > 
              Cost
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'cost' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'cost' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
            <th 
              role='button'
              onClick={() => handleClick('date', setSortOrder, setSortColumn, sortColumn, sortOrder)}
            >
              Date
              <i className={cn("bi", 
                {'bi-sort-down' : (sortColumn === 'date' && sortOrder === 'asc'),
                  'bi-sort-up' : (sortColumn === 'date' && sortOrder === 'desc')
                })}
              >

              </i>
            </th>
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