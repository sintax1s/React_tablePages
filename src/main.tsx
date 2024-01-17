import App from './App.tsx';
import './index.css';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AccountsPage from './Pages/AccountsPage.tsx';
import ProfilesPage from './Pages/ProfilesPage.tsx';
import { createRoot } from 'react-dom/client';
import CampaignsPage from './Pages/CampaignsPage.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <Router>
      <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<AccountsPage />} />
        <Route path='Profiles/:AccountId' element={<ProfilesPage />} />
        <Route path='Campaigns/:ProfileId' element={<CampaignsPage />} />
      </Route>     
      </Routes>
  </Router>,
)
