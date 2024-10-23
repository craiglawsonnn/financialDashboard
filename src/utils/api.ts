import axios from 'axios';

const API_KEY = '4Q0QKO7FCIZ4CTQV';
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchStockData(symbol: string, timeRange: string) {
    const interval = timeRange === '1D' ? '5min' : 'daily';
    const function_name = interval === '5min' ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY';
    
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: function_name,
          symbol,
          interval,
          apikey: API_KEY,
        },
      });
  
      const timeSeries = response.data[`Time Series (${interval})`];
      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        price: parseFloat(values['4. close']),
      })).reverse();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }
  
  export async function fetchExchangeRates() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'USD',
          to_currency: 'EUR',
          apikey: API_KEY,
        },
      });
  
      const rate = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      return { USD: 1, EUR: rate };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return { USD: 1, EUR: 1 };
    }
  }
