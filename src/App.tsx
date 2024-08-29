import reactLogo from './assets/react.svg';
import { useState } from 'react';
import axios from 'axios';

import './App.css'

const currencies = ['CAD', 'USD', 'EUR', 'GBP', 'JPY', 'INR'];

function App() {
  const [fromCurrency, setFromCurrency] = useState<string>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<string>(currencies[1]);
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    setConvertedAmount(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8080/convert', {
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount: amount,
        },
      });
      setConvertedAmount(response.data.amount);
    } catch (error) {
      setError('Error fetching conversion rate. Please try again.');
      console.error('Error fetching conversion rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
    setConvertedAmount(null);  
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
    setConvertedAmount(null);  
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
    setConvertedAmount(null);  
  };

  return (
    <div>
      <div>
        <a>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Currency Converter</h1>

      <div className="card">
        <div >
        <label htmlFor="fromCurrency">FROM: </label>
        <select id="fromCurrency" value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="toCurrency">TO: </label>
        <select id="toCurrency" value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount">Amount: </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>

      {convertedAmount !== null && (
          <div className="result">
            <h2>
              $ {convertedAmount} {toCurrency}
            </h2>
          </div>
        )}

        {error && (
          <div className="error">
            <h2>{error}</h2>
          </div>
        )}
        
      </div>

      <button onClick={handleConvert} disabled={loading}>
          {loading ? 'Converting...' : 'Convert'}
      </button>

    </div>
  )
}

export default App
