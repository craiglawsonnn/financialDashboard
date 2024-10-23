import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockData, fetchMultipleStocks } from '../utils/api';

type StockData = {
  date: string;
  price: number;
};

type StockOverview = {
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
};

const MarketOverview: React.FC = () => {
  const [stockOverviews, setStockOverviews] = useState<StockOverview[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState<string>('DAILY');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN']; // You can add more symbols
    setIsLoading(true);
    fetchMultipleStocks(symbols)
      .then(setStockOverviews)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedStock) {
      setIsLoading(true);
      fetchStockData(selectedStock, timeRange)
        .then(setStockData)
        .finally(() => setIsLoading(false));
    }
  }, [selectedStock, timeRange]);

  return (
    <div className="market-overview">
      <h3>Market Overview</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {stockOverviews.map((stock) => (
              <li key={stock.symbol} onClick={() => setSelectedStock(stock.symbol)} style={{cursor: 'pointer'}}>
                {stock.symbol}: ${stock.price.toFixed(2)} (Volume: {stock.volume})
              </li>
            ))}
          </ul>
          {selectedStock && (
            <div>
              <h4>{selectedStock} Stock Price</h4>
              <div className="time-range-buttons">
                <button onClick={() => setTimeRange('INTRADAY')}>Intraday</button>
                <button onClick={() => setTimeRange('DAILY')}>Daily</button>
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
              {stockData.length > 0 && (
                <div className="stock-info">
                  <p>Latest Price: ${stockData[stockData.length - 1].price.toFixed(2)}</p>
                  <p>Open: ${stockData[0].price.toFixed(2)}</p>
                  <p>High: ${Math.max(...stockData.map(d => d.price)).toFixed(2)}</p>
                  <p>Low: ${Math.min(...stockData.map(d => d.price)).toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketOverview;
