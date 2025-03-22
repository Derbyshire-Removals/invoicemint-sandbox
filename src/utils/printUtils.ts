
import { Invoice, Company } from "@/types";
import { format } from "date-fns";

export const printInvoice = (invoice: Invoice, company: Company | null) => {
  if (!invoice || !company) return;
  
  // Format dates
  const formattedDate = format(new Date(invoice.date), "MMMM d, yyyy");
  const formattedDueDate = format(new Date(invoice.dueDate), "MMMM d, yyyy");
  
  // Format currency
  const currencySymbol = company.currency || "$";
  
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
        <title>Invoice ${invoice.invoiceNumber}</title>
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
          <div class="card">
            <div class="card-header">
              <div class="header-content">
                <div>
                  <h1>Invoice</h1>
                  <div class="invoice-details">
                    <p>${invoice.invoiceNumber}</p>
                    <p>Issue Date: ${formattedDate}</p>
                    <p>Due Date: ${formattedDueDate}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="sender-details">
                    <div class="sender-name">${company.name}</div>
                    <div class="sender-address">${company.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-content">
              <div class="billing-grid">
                <div>
                  <h2>Bill To:</h2>
                  <div class="bill-to-name">${invoice.customer.name}</div>
                  <div class="bill-to-address">${invoice.customer.address}</div>
                  ${invoice.customer.email ? `<div class="bill-to-email">${invoice.customer.email}</div>` : ''}
                  ${invoice.customer.phone ? `<div class="bill-to-phone">${invoice.customer.phone}</div>` : ''}
                </div>
                <div class="text-right">
                  <h2>Amount Due:</h2>
                  <div class="amount-due">${currencySymbol}${invoice.total.toFixed(2)}</div>
                </div>
              </div>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th class="text-left">Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoice.items.map(item => `
                      <tr>
                        <td class="text-left">${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${currencySymbol}${item.unitPrice.toFixed(2)}</td>
                        <td>${currencySymbol}${item.total.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="totals-section">
                <div class="totals-container">
                  <div class="totals-row">
                    <span>Subtotal:</span>
                    <span>${currencySymbol}${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="totals-row">
                    <span>Tax (${invoice.taxRate}%):</span>
                    <span>${currencySymbol}${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div class="separator"></div>
                  <div class="totals-row total">
                    <span>Total:</span>
                    <span>${currencySymbol}${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              ${invoice.notes || company.notes ? `
                <div class="notes-section">
                  <h3>Notes</h3>
                  <p>${invoice.notes || company.notes || ''}</p>
                </div>
              ` : ''}
            </div>

            <div class="card-footer">
              Thank you for your business!
            </div>
          </div>
          <div class="print-button">
            <button onclick="window.print(); window.close();">Print Invoice</button>
          </div>
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

// Helper function to get status text with proper capitalization
function getStatusText(status: 'draft' | 'sent' | 'paid' | 'overdue'): string {
  const statusMap: Record<typeof status, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue'
  };
  
  return statusMap[status] || 'Unknown';
}
