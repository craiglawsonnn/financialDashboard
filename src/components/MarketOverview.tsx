import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockData, fetchMultipleStocks } from '../utils/api';

type StockData = {
  date: string;
  price: number;
};

type StockOverview = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

const MarketOverview: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1M');
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock, timeRange).then(setStockData);
    }
  }, [selectedStock, timeRange]);

  const handleZoom = (domain: { refAreaLeft: number; refAreaRight: number }) => {
    if (domain.refAreaLeft && domain.refAreaRight) {
      setZoomDomain({ start: domain.refAreaLeft, end: domain.refAreaRight });
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

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
        <button onClick={handleResetZoom}>Reset Zoom</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={stockData}
          ref={chartRef}
          onMouseDown={() => {}}
          onMouseMove={(e) => e && e.activeLabel && handleZoom(e.activeLabel)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            domain={zoomDomain ? [zoomDomain.start, zoomDomain.end] : ['auto', 'auto']}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketOverview;
