import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders wifi portal hero text', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /connect to zimworx guest wi-fi/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
