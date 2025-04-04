
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

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  console.log("InvoiceProvider rendering");
  
  const { currentCompany, incrementInvoiceCounter } = useCompany();
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      console.log("Loading invoices from localStorage:", savedInvoices);
      
      if (savedInvoices) {
        const parsed = JSON.parse(savedInvoices);
        
        const formattedInvoices = parsed.map((invoice: any) => ({
          ...invoice,
          items: invoice.items.map((item: any) => ({
            id: String(item.id),
            description: String(item.description || ''),
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.total)
          })),
          subtotal: Number(invoice.subtotal),
          taxRate: Number(invoice.taxRate),
          taxAmount: Number(invoice.taxAmount),
          total: Number(invoice.total)
        }));
        
        console.log("Formatted invoices after loading:", formattedInvoices);
        return formattedInvoices;
      }
      return [];
    } catch (error) {
      console.error("Error loading invoices from localStorage:", error);
      return [];
    }
  });

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
      
      if (!invoiceData.invoiceNumber) {
        toast.error("Invoice number is required");
        throw new Error("Invoice number is required");
      }
      
      incrementInvoiceCounter();
      
      const formattedItems = invoiceData.items.map(item => ({
        id: String(item.id),
        description: String(item.description),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total)
      }));
      
      const newInvoice: Invoice = {
        ...invoiceData,
        items: formattedItems,
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
    console.log("Updating invoice with ID:", id, "Data:", invoiceData);
    
    let updatedData = { ...invoiceData };
    
    if (invoiceData.items) {
      // Ensure all item properties are the correct types
      updatedData.items = invoiceData.items.map(item => ({
        id: String(item.id),
        description: String(item.description),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total)
      }));
      
      console.log("Formatted items for update:", updatedData.items);
    }
    
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id === id) {
          const updated = { 
            ...invoice, 
            ...updatedData, 
            updatedAt: new Date() 
          };
          console.log("Updated invoice in state:", updated);
          return updated;
        }
        return invoice;
      })
    );
    
    toast.success("Invoice updated");
  };

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
