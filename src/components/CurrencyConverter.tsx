import React, { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../utils/api';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getExchangeRate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchExchangeRate(fromCurrency, toCurrency);
        setExchangeRate(data.exchangeRate);
      } catch (err) {
        setError('Error fetching exchange rate. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="currency-converter">
      <h3>Currency Converter</h3>
      <input type="number" value={amount} onChange={handleAmountChange} />
      <select value={fromCurrency} onChange={handleFromCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="JPY">JPY</option>
        {/* Add more currency options as needed */}
      </select>
      <span>to</span>
      <select value={toCurrency} onChange={handleToCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="JPY">JPY</option>
        {/* Add more currency options as needed */}
      </select>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
