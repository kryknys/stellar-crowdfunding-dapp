import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import MyCampaigns from './pages/MyCampaigns';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-stellar-blue via-stellar-purple to-stellar-light">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateCampaign />} />
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/my-campaigns" element={<MyCampaigns />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
