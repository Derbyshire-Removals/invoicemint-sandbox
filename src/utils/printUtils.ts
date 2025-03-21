
export const printInvoice = (invoiceContent: HTMLElement | string | null) => {
  if (!invoiceContent) return;
  
  // Get the HTML content
  let htmlContent: string;
  if (typeof invoiceContent === 'string') {
    htmlContent = invoiceContent;
  } else {
    // Clone the invoice content
    const printContent = invoiceContent.cloneNode(true) as HTMLElement;
    htmlContent = printContent.outerHTML;
  }
  
  // Create a new window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Please allow popups to print invoices.');
    return;
  }
  
  // Write the content to the new window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
            background-color: #fff;
            margin: 0;
            padding: 0;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            position: relative;
          }
          
          .invoice-header {
            padding: 2rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .invoice-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.25rem;
            font-weight: 700;
            color: #111827;
            margin: 0 0 1rem;
            letter-spacing: -0.025em;
          }
          
          .invoice-content {
            padding: 2rem;
          }
          
          .invoice-meta {
            color: #4b5563;
            font-size: 0.875rem;
          }
          
          .invoice-meta p {
            margin: 0.25rem 0;
          }
          
          .company-details {
            text-align: right;
          }
          
          .company-details .company-name {
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 0.25rem;
            color: #111827;
          }
          
          .company-details .company-address {
            color: #4b5563;
            font-size: 0.875rem;
            white-space: pre-line;
          }
          
          .bill-to {
            margin-top: 2rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
          }
          
          .bill-to-section h2, .amount-due-section h2 {
            text-transform: uppercase;
            font-size: 0.75rem;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 0.5rem;
            letter-spacing: 0.05em;
          }
          
          .bill-to-section .customer-name {
            font-weight: 600;
            font-size: 1rem;
            color: #111827;
            margin: 0 0 0.25rem;
          }
          
          .bill-to-section .customer-address {
            color: #4b5563;
            font-size: 0.875rem;
            white-space: pre-line;
            margin-bottom: 0.5rem;
          }
          
          .bill-to-section .customer-email,
          .bill-to-section .customer-phone {
            color: #4b5563;
            font-size: 0.875rem;
            margin: 0.125rem 0;
          }
          
          .amount-due-section {
            text-align: right;
          }
          
          .amount-due-section .amount {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          
          th {
            background-color: #f9fafb;
            color: #4b5563;
            text-align: left;
            padding: 0.75rem;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
          }
          
          td {
            padding: 0.75rem;
            border-bottom: 1px solid #f3f4f6;
            color: #111827;
          }
          
          .text-right {
            text-align: right;
          }
          
          .invoice-summary {
            margin-left: auto;
            width: 33.333%;
          }
          
          .invoice-summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            font-size: 0.875rem;
            color: #4b5563;
          }
          
          .invoice-summary-row.final {
            font-weight: 600;
            border-top: 1px solid #e5e7eb;
            padding-top: 0.75rem;
            margin-top: 0.25rem;
            color: #111827;
          }
          
          .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-bottom: 1rem;
          }
          
          .status-draft {
            background-color: #f3f4f6;
            color: #4b5563;
          }
          
          .status-sent {
            background-color: #dbeafe;
            color: #1e40af;
          }
          
          .status-paid {
            background-color: #dcfce7;
            color: #166534;
          }
          
          .status-overdue {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          
          .invoice-notes {
            border-top: 1px solid #e5e7eb;
            padding-top: 1.5rem;
            margin-top: 1.5rem;
          }
          
          .invoice-notes h3 {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0 0 0.5rem;
            color: #4b5563;
          }
          
          .invoice-notes p {
            color: #6b7280;
            font-size: 0.875rem;
            white-space: pre-line;
            margin: 0;
          }
          
          .invoice-footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
          }
          
          .no-print {
            display: none;
          }
          
          @media print {
            body {
              padding: 0;
              background: none;
            }
            
            .invoice-container {
              box-shadow: none;
              max-width: none;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${htmlContent}
        </div>
        <div class="no-print" style="text-align: center; margin-top: 2rem;">
          <button onclick="window.print(); window.close();" style="padding: 0.5rem 1.5rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Print Invoice
          </button>
        </div>
        <script>
          // Auto print after a short delay
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};
