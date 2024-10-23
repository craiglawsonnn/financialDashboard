import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockData, fetchMultipleStocks } from '../utils/api';

type StockData = {
  date: string;
  price: number;
};

const MarketOverview: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1M');
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchStockData(selectedStock, timeRange);
        if (data.length === 0) {
          setError('No data available for the selected stock and time range.');
        } else {
          setStockData(data);
        }
      } catch (err) {
        setError('An error occurred while fetching stock data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStock, timeRange]);

  return (
    <div className="market-overview">
      <h3>Market Overview</h3>
      <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
        <option value="AAPL">Apple</option>
        <option value="GOOGL">Google</option>
        <option value="MSFT">Microsoft</option>
        <option value="AMZN">Amazon</option>
      </select>
      <div>
        <button onClick={() => setTimeRange('1D')}>1D</button>
        <button onClick={() => setTimeRange('1W')}>1W</button>
        <button onClick={() => setTimeRange('1M')}>1M</button>
        <button onClick={() => setTimeRange('3M')}>3M</button>
        <button onClick={() => setTimeRange('1Y')}>1Y</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && stockData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MarketOverview;
