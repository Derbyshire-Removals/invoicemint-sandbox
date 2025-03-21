export interface Company {
  id: string;
  name: string;
  address: string;
  invoicePrefix: string;
  invoiceCounter: number;
  currency: string;
  notes: string;
  paymentTerms: number; // Number of days to pay within
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  customer: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}
