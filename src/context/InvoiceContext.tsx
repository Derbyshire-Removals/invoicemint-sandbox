import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '@/types';
import { useCompany } from './CompanyContext';
import { toast } from "sonner";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  updateInvoiceNumber: (id: string, invoiceNumber: string) => void;
  deleteInvoice: (id: string) => void;
  getInvoicesByCompany: (companyId: string) => Invoice[];
  calculateTotals: (items: InvoiceItem[], taxRate: number) => { 
    subtotal: number; 
    taxAmount: number; 
    total: number; 
  };
  createEmptyInvoiceItem: () => InvoiceItem;
}

// Create context with a default value
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  // Debug whether the provider is rendering
  console.log("InvoiceProvider rendering");
  
  const { currentCompany, incrementInvoiceCounter } = useCompany();
  
  // Load invoices from localStorage or initialize with empty array
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      console.log("Loading invoices from localStorage:", savedInvoices);
      return savedInvoices ? JSON.parse(savedInvoices) : [];
    } catch (error) {
      console.error("Error loading invoices from localStorage:", error);
      return [];
    }
  });

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    try {
      console.log("Saving invoices to localStorage:", invoices);
      localStorage.setItem('invoices', JSON.stringify(invoices));
    } catch (error) {
      console.error("Error saving invoices to localStorage:", error);
    }
  }, [invoices]);

  const getInvoicesByCompany = (companyId: string) => {
    return invoices.filter(invoice => invoice.companyId === companyId);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentCompany) {
      toast.error("No company selected. Please select or create a company first.");
      throw new Error("No company selected");
    }
    
    try {
      console.log("Adding invoice with data:", invoiceData);
      
      // User will now provide the invoice number
      // If no invoice number is provided in the data, still increment the counter
      if (!invoiceData.invoiceNumber) {
        toast.error("Invoice number is required");
        throw new Error("Invoice number is required");
      }
      
      // Still increment the counter to keep it moving forward
      incrementInvoiceCounter();
      
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log("Created new invoice:", newInvoice);
      
      setInvoices(prev => {
        const updated = [...prev, newInvoice];
        console.log("Updated invoices array:", updated);
        return updated;
      });
      
      toast.success(`Invoice ${invoiceData.invoiceNumber} created`);
      return newInvoice;
    } catch (error) {
      console.error("Error in addInvoice:", error);
      toast.error("Failed to create invoice. Please try again.");
      throw error;
    }
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

  // Function to update invoice number specifically
  const updateInvoiceNumber = (id: string, invoiceNumber: string) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id 
          ? { ...invoice, invoiceNumber, updatedAt: new Date() } 
          : invoice
      )
    );
    
    toast.success("Invoice number updated");
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

  // Create the context value object
  const contextValue: InvoiceContextType = {
    invoices,
    addInvoice,
    updateInvoice,
    updateInvoiceNumber,
    deleteInvoice,
    getInvoicesByCompany,
    calculateTotals,
    createEmptyInvoiceItem
  };

  return (
    <InvoiceContext.Provider value={contextValue}>
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
