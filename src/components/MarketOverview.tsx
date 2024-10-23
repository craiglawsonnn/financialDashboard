import React, { useEffect, useState } from 'react';

type FinancialData = {
  symbol: string;
  price: number;
  change: number;
};

const MarketOverview: React.FC = () => {
  const [data, setData] = useState<FinancialData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/financial-data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="market-overview">
      <h3>Market Overview</h3>
      <ul>
        {data.map((item) => (
          <li key={item.symbol}>
            {item.symbol}: ${item.price.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketOverview;
