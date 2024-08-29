import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import App from './App';

vi.mock('axios');

describe('App Component', () => {
  it('renders the App component correctly', () => {
    render(<App />);

    // Check for static elements
    expect(screen.getByText(/Currency Converter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/FROM:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/TO:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Convert/i })).toBeInTheDocument();
  });

  it('disables the convert button when loading', async () => {
    render(<App />);
    
    const button = screen.getByRole('button', { name: /Convert/i });
    
    // Simulate loading state
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
  });

  it('shows converted amount on successful API response', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { amount: 100 } });

    render(<App />);

    const amountInput = screen.getByLabelText(/Amount:/i);
    const convertButton = screen.getByRole('button', { name: /Convert/i });

    // Set an amount
    fireEvent.change(amountInput, { target: { value: '10' } });

    // Trigger conversion
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText(/\$ 100/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<App />);

    const amountInput = screen.getByLabelText(/Amount:/i);
    const convertButton = screen.getByRole('button', { name: /Convert/i });

    // Set an amount
    fireEvent.change(amountInput, { target: { value: '10' } });

    // Trigger conversion
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching conversion rate/i)).toBeInTheDocument();
    });
  });

  it('clears previous conversion result when changing currency or amount', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { amount: 100 } });
  
    render(<App />);
  
    // Query the amount input by its label
    const amountInput = screen.getByLabelText(/Amount:/i);
  
    // Query the "FROM" currency select box by its label
    const fromCurrencySelect = screen.getByLabelText(/FROM:/i);
  
    // Query the button by its role and name
    const convertButton = screen.getByRole('button', { name: /Convert/i });
  
    // Set an amount and trigger conversion
    fireEvent.change(amountInput, { target: { value: '10' } });
    fireEvent.click(convertButton);
  
    await waitFor(() => {
      expect(screen.getByText(/\$ 100/i)).toBeInTheDocument();
    });
  
    // Change the currency
    fireEvent.change(fromCurrencySelect, { target: { value: 'EUR' } });
  
    // Ensure the result is cleared
    expect(screen.queryByText(/\$ 100/i)).toBeNull();
  });
  
});
