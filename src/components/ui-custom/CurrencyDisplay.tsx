
import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = "$",
  className = "",
}) => {
  return (
    <span className={className}>
      {currency}{amount.toFixed(2)}
    </span>
  );
};
