import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '@/types';
import { useCompany } from './CompanyContext';
import { toast } from "sonner";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoicesByCompany: (companyId: string) => Invoice[];
  calculateTotals: (items: InvoiceItem[], taxRate: number) => { 
    subtotal: number; 
    taxAmount: number; 
    total: number; 
  };
  createEmptyInvoiceItem: () => InvoiceItem;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const { currentCompany, incrementInvoiceCounter } = useCompany();
  
  // Load invoices from localStorage or initialize with empty array
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const getInvoicesByCompany = (companyId: string) => {
    return invoices.filter(invoice => invoice.companyId === companyId);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    if (!currentCompany) {
      toast.error("No company selected. Please select or create a company first.");
      return;
    }
    
    // Generate invoice number
    const invoiceNumber = `${currentCompany.invoicePrefix}${currentCompany.invoiceCounter.toString().padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      invoiceNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    incrementInvoiceCounter();
    
    toast.success(`Invoice ${invoiceNumber} created`);
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...invoiceData, updatedAt: new Date() } 
          : invoice
      )
    );
    
    toast.success("Invoice updated");
  };

  const deleteInvoice = (id: string) => {
    // Get the invoice number before deletion
    const invoiceToDelete = invoices.find(invoice => invoice.id === id);
    
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    
    toast.success(`Invoice ${invoiceToDelete?.invoiceNumber} deleted`);
  };

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };
  
  const createEmptyInvoiceItem = (): InvoiceItem => ({
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicesByCompany,
        calculateTotals,
        createEmptyInvoiceItem
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}
