import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../utils/api';

type ExchangeRates = {
  [key: string]: number;
};

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    fetchExchangeRates().then(setExchangeRates);
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      setConvertedAmount(amount * rate);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  return (
    <div className="currency-converter">
      <h3>Currency Converter</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        {Object.keys(exchangeRates).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <span>to</span>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        {Object.keys(exchangeRates).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      {convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
