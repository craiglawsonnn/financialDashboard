import React, { useState } from 'react';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<string>('');

  const handleConvert = () => {
    // This is a mock conversion. In a real app, you'd use an API for live rates.
    const rate = 0.85; // Mock EUR/USD rate
    const converted = parseFloat(amount) * rate;
    setResult(`${amount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`);
  };

  return (
    <div className="currency-converter">
      <h3>Currency Converter</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
      <button onClick={handleConvert}>Convert</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default CurrencyConverter;
