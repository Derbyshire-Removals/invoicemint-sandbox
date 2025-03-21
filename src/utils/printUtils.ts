/**
 * Opens a print popup window with the invoice content
 * @param invoiceHtml - The invoice HTML content
 * @param title - Title for the popup window
 */
export const printInvoice = (invoiceHtml: string, title: string = 'Invoice') => {
  // Create a new popup window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups for this website to print invoices.');
    return;
  }
  
  // Generate the HTML document for the popup
  const printDocument = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
      <style>
        /* Reset styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #333;
          line-height: 1.5;
          padding: 2rem;
          background-color: #fff;
        }
        
        /* Print-specific styles */
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            padding: 0;
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        /* Common styles */
        .print-container {
          max-width: 100%;
          margin: 0 auto;
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
        
        /* Print button */
        .print-button {
          display: block;
          margin: 2rem auto;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .print-button:hover {
          background-color: #2563eb;
        }
        
        @media print {
          .print-button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${invoiceHtml}
      </div>
      <button class="print-button no-print" onclick="window.print()">Print Invoice</button>
      <script>
        // Auto-trigger print dialog after a short delay
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;
  
  // Write the HTML to the popup
  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};
