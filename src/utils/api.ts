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

    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = response.data[timeSeriesKey];

    if (!timeSeries) {
      console.error('Unexpected API response structure:', response.data);
      return [];
    }

    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      price: parseFloat(values['4. close']),
    })).reverse();
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: API_KEY,
      },
    });

    const exchangeRateData = response.data['Realtime Currency Exchange Rate'];
    if (!exchangeRateData) {
      console.error('Unexpected API response structure:', response.data);
      return null;
    }

    const exchangeRate = exchangeRateData['5. Exchange Rate'];
    return parseFloat(exchangeRate);
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}
