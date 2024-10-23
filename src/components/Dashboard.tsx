import React from 'react';
import MarketOverview from './MarketOverview';
import CurrencyConverter from './CurrencyConverter';

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendering');
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="module">
          <MarketOverview />
        </div>
        <div className="module">
          <CurrencyConverter />
        </div>
        <div className="module">News Feed</div>
        <div className="module">Portfolio Tracker</div>
      </div>
    </div>
  );
};

export default Dashboard;
