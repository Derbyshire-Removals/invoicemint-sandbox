
export const printInvoice = (invoiceContent: HTMLElement | null) => {
  if (!invoiceContent) return;
  
  // Clone the invoice content
  const printContent = invoiceContent.cloneNode(true) as HTMLElement;
  
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
        <link href="https://unpkg.com/tailwindcss@^3/dist/tailwind.min.css" rel="stylesheet">
        
        <style>
          
                      /* Reset and base styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.5;
                color: #1a1a1a;
                background-color: #f5f5f5;
                padding: 2rem;
            }
            
            /* Container styles */
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .card {
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            /* Header styles */
            .card-header {
                padding: 2rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .header-content {
                display: flex;
                justify-content: space-between;
            }
            
            h1 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .invoice-details {
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            .invoice-details p {
                margin-bottom: 0.25rem;
            }
            
            .text-right {
                text-align: right;
            }
            
            .status-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
                margin-bottom: 0.5rem;
            }
            
            .sender-name {
                font-size: 0.875rem;
                font-weight: 600;
            }
            
            .sender-address {
                font-size: 0.875rem;
                color: #6b7280;
                white-space: pre-line;
            }
            
            /* Content styles */
            .card-content {
                padding: 2rem;
            }
            
            .billing-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            h2 {
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #6b7280;
                font-weight: 600;
                letter-spacing: 0.05em;
                margin-bottom: 0.5rem;
            }
            
            .bill-to-name {
                font-weight: 500;
            }
            
            .bill-to-address {
                color: #6b7280;
                white-space: pre-line;
            }
            
            .amount-due {
                font-size: 1.875rem;
                font-weight: 700;
            }
            
            /* Table styles */
            .table-container {
                margin-bottom: 2rem;
                overflow-x: auto;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.875rem;
            }
            
            th {
                background-color: #f9fafb;
                padding: 0.75rem 1rem;
                text-align: right;
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #6b7280;
                font-weight: 600;
            }
            
            th.text-left {
                text-align: left;
            }
            
            td {
                padding: 1rem;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
            }
            
            td.text-left {
                text-align: left;
            }
            
            /* Totals section */
            .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 2rem;
            }
            
            .totals-container {
                width: 33.333333%;
            }
            
            .totals-row {
                display: flex;
                justify-content: space-between;
                font-size: 0.875rem;
                margin-bottom: 0.5rem;
            }
            
            .totals-row span:first-child {
                color: #6b7280;
            }
            
            .separator {
                height: 1px;
                background-color: #e5e7eb;
                margin: 0.5rem 0;
            }
            
            .total {
                font-weight: 700;
            }
            
            /* Notes section */
            .notes-section {
                padding-top: 1rem;
                border-top: 1px solid #e5e7eb;
            }
            
            .notes-section h3 {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .notes-section p {
                color: #6b7280;
                white-space: pre-line;
            }
            
            /* Footer */
            .card-footer {
                border-top: 1px solid #e5e7eb;
                padding: 2rem;
                text-align: center;
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            /* Print button */
            .print-button {
                text-align: center;
                margin-top: 2rem;
            }
            
            .print-button button {
                padding: 0.5rem 1.5rem;
                background-color: #4f46e5;
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-weight: 500;
                font-size: 0.875rem;
                transition: background-color 0.2s;
            }
            
            .print-button button:hover {
                background-color: #4338ca;
            }
            
            /* Print styles */
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
            
                .card {
                    box-shadow: none;
                }
            
                .print-button {
                    display: none;
                }
            }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${printContent.outerHTML}
        </div>
        <div class="no-print" style="text-align: center; margin-top: 2rem;">
          <button onclick="window.print(); window.close();" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: 500;">
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
