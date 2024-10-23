import axios from 'axios';

const API_KEY = '4Q0QKO7FCIZ4CTQV';
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
    const responses = await Promise.all(
      symbols.map(symbol =>
        axios.get(BASE_URL, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: API_KEY,
          },
        })
      )
    );

    return responses.map(response => {
      const data = response.data['Global Quote'];
      return {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: parseFloat(data['10. change percent'].replace('%', '')),
      };
    });
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    return [];
  }
}
