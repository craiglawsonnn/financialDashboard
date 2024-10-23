import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FinancialData = {
  symbol: string;
  price: number;
  change: number;
};

type StockData = {
  date: string;
  price: number;
};

const MarketOverview: React.FC = () => {
  const [data, setData] = useState<FinancialData[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1M');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/financial-data');
        const jsonData = await response.json();
        setData(jsonData);
        if (jsonData.length > 0) {
          setSelectedStock(jsonData[0].symbol);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock, timeRange);
    }
  }, [selectedStock, timeRange]);

  const fetchStockData = async (symbol: string, range: string) => {
    // In a real app, you'd fetch this data from an API
    // For now, we'll generate mock data
    const mockData = generateMockStockData(range);
    setStockData(mockData);
  };

  const generateMockStockData = (range: string): StockData[] => {
    const data: StockData[] = [];
    const now = new Date();
    const daysToGenerate = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
    
    for (let i = daysToGenerate; i > 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.random() * 100 + 100, // Random price between 100 and 200
      });
    }
    
    return data;
  };

  return (
    <div className="market-overview">
      <h3>Market Overview</h3>
      <ul>
        {data.map((item) => (
          <li key={item.symbol} onClick={() => setSelectedStock(item.symbol)} style={{cursor: 'pointer'}}>
            {item.symbol}: ${item.price.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%)
          </li>
        ))}
      </ul>
      {selectedStock && (
        <div>
          <h4>{selectedStock} Stock Price</h4>
          <div className="time-range-buttons">
            <button onClick={() => setTimeRange('1D')}>1D</button>
            <button onClick={() => setTimeRange('5D')}>5D</button>
            <button onClick={() => setTimeRange('1M')}>1M</button>
            <button onClick={() => setTimeRange('6M')}>6M</button>
            <button onClick={() => setTimeRange('1Y')}>1Y</button>
            <button onClick={() => setTimeRange('5Y')}>5Y</button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin', 'dataMax']} />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="stock-info">
            <p>Previous Close: {stockData[stockData.length - 2]?.price.toFixed(2)}</p>
            <p>Open: {stockData[0]?.price.toFixed(2)}</p>
            <p>Day's Range: {Math.min(...stockData.map(d => d.price)).toFixed(2)} - {Math.max(...stockData.map(d => d.price)).toFixed(2)}</p>
            {/* Add more stock information here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOverview;
