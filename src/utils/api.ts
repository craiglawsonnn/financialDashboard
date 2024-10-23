import axios from 'axios';

const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchStockData(symbol: string, interval: string = 'DAILY') {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: interval === 'INTRADAY' ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY',
        symbol,
        interval: interval === 'INTRADAY' ? '5min' : undefined,
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data[interval === 'INTRADAY' ? 'Time Series (5min)' : 'Time Series (Daily)'];
    
    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      price: parseFloat(values['4. close']),
    })).reverse();
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

export async function fetchMultipleStocks(symbols: string[]) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'BATCH_STOCK_QUOTES',
        symbols: symbols.join(','),
        apikey: API_KEY,
      },
    });

    return response.data['Stock Quotes'].map((quote: any) => ({
      symbol: quote['1. symbol'],
      price: parseFloat(quote['2. price']),
      volume: parseInt(quote['3. volume']),
      timestamp: quote['4. timestamp'],
    }));
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    return [];
  }
}
