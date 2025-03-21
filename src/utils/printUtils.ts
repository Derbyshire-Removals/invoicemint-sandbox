
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
        <style>
          <script src="https://cdn.tailwindcss.com"></script>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 2rem;
            color: #333;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .invoice-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e4e4e7;
          }
          
          .invoice-content {
            padding: 2rem;
          }
          
          .invoice-footer {
            padding: 2rem;
            border-top: 1px solid #e4e4e7;
            text-align: center;
            color: #71717a;
            font-size: 0.875rem;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          
          th {
            text-align: left;
            padding: 0.75rem 0.5rem;
            border-bottom: 1px solid #e4e4e7;
            font-weight: 600;
          }
          
          td {
            padding: 0.75rem 0.5rem;
            border-bottom: 1px solid #f4f4f5;
          }
          
          .text-right {
            text-align: right;
          }
          
          .invoice-total {
            margin-left: auto;
            width: 33.333%;
          }
          
          .invoice-total-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
          }
          
          .invoice-total-row.final {
            font-weight: 600;
            border-top: 1px solid #e4e4e7;
            padding-top: 0.75rem;
            margin-top: 0.25rem;
          }
          
          .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          .status-draft {
            background-color: #f3f4f6;
            color: #4b5563;
          }
          
          .status-sent {
            background-color: #f0f9ff;
            color: #0369a1;
          }
          
          .status-paid {
            background-color: #f0fdf4;
            color: #15803d;
          }
          
          .status-overdue {
            background-color: #fef2f2;
            color: #b91c1c;
          }
          
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            
            body {
              padding: 0;
            }
            
            .no-print {
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
