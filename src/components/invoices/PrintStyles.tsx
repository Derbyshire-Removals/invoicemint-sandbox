
import React from 'react';

export const PrintStyles: React.FC = () => {
  return (
    <style jsx="true">{`
      @media print {
        @page {
          size: A4;
          margin: 1cm;
        }
        
        body {
          font-family: 'Inter', system-ui, sans-serif;
          color: #333;
          line-height: 1.5;
        }
        
        .print-container {
          max-width: 100%;
          padding: 0;
          margin: 0;
          box-shadow: none;
          border: none;
        }
        
        .print-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .company-details {
          text-align: left;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .invoice-title {
          font-size: 1.875rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }
        
        .invoice-number {
          font-size: 1.25rem;
          color: #4a5568;
          margin-bottom: 1rem;
        }
        
        .invoice-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .customer-details, .payment-details {
          padding: 1.25rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
        }
        
        .section-title {
          font-weight: 600;
          font-size: 1rem;
          color: #4a5568;
          margin-bottom: 0.75rem;
        }
        
        .invoice-items {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        
        .invoice-items th {
          background-color: #f1f5f9;
          color: #4a5568;
          font-weight: 600;
          text-align: left;
          padding: 0.75rem 1rem;
        }
        
        .invoice-items td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .invoice-items tr:last-child td {
          border-bottom: none;
        }
        
        .invoice-totals {
          width: 40%;
          margin-left: auto;
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }
        
        .totals-row.final {
          font-weight: bold;
          font-size: 1.125rem;
          border-top: 2px solid #e2e8f0;
          padding-top: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .invoice-notes {
          margin-top: 2rem;
          padding: 1.25rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-badge.draft {
          background-color: #e2e8f0;
          color: #4a5568;
        }
        
        .status-badge.sent {
          background-color: #eff6ff;
          color: #3b82f6;
        }
        
        .status-badge.paid {
          background-color: #ecfdf5;
          color: #10b981;
        }
        
        .status-badge.overdue {
          background-color: #fef2f2;
          color: #ef4444;
        }
        
        .no-print {
          display: none !important;
        }
      }
      
      /* Styles for the screen preview */
      .print-container {
        max-width: 210mm;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 0.5rem;
      }
      
      .print-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .company-details {
        text-align: left;
      }
      
      .invoice-details {
        text-align: right;
      }
      
      .invoice-title {
        font-size: 1.875rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #1a1a1a;
      }
      
      .invoice-number {
        font-size: 1.25rem;
        color: #4a5568;
        margin-bottom: 1rem;
      }
      
      .invoice-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      .customer-details, .payment-details {
        padding: 1.25rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
      }
      
      .section-title {
        font-weight: 600;
        font-size: 1rem;
        color: #4a5568;
        margin-bottom: 0.75rem;
      }
      
      .invoice-items {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
      }
      
      .invoice-items th {
        background-color: #f1f5f9;
        color: #4a5568;
        font-weight: 600;
        text-align: left;
        padding: 0.75rem 1rem;
      }
      
      .invoice-items td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .invoice-items tr:last-child td {
        border-bottom: none;
      }
      
      .invoice-totals {
        width: 40%;
        margin-left: auto;
      }
      
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
      }
      
      .totals-row.final {
        font-weight: bold;
        font-size: 1.125rem;
        border-top: 2px solid #e2e8f0;
        padding-top: 0.75rem;
        margin-top: 0.5rem;
      }
      
      .invoice-notes {
        margin-top: 2rem;
        padding: 1.25rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
      }
      
      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
      }
      
      .status-badge.draft {
        background-color: #e2e8f0;
        color: #4a5568;
      }
      
      .status-badge.sent {
        background-color: #eff6ff;
        color: #3b82f6;
      }
      
      .status-badge.paid {
        background-color: #ecfdf5;
        color: #10b981;
      }
      
      .status-badge.overdue {
        background-color: #fef2f2;
        color: #ef4444;
      }
    `}</style>
  );
};
