import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '@/types';
import { toast } from "sonner";

// Initialize with sample companies
const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Company A',
    address: '123 Business St, Suite 101, New York, NY 10001',
    invoicePrefix: 'INV-A',
    invoiceCounter: 1,
    currency: '$',
    notes: 'Thank you for your business!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Company B',
    address: '456 Corporate Ave, Floor 12, San Francisco, CA 94105',
    invoicePrefix: 'INV-B',
    invoiceCounter: 1,
    currency: '$',
    notes: 'Payment due within 30 days.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company) => void;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  incrementInvoiceCounter: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  // Try to load companies from localStorage
  const [companies, setCompanies] = useState<Company[]>(() => {
    const savedCompanies = localStorage.getItem('companies');
    return savedCompanies ? JSON.parse(savedCompanies) : initialCompanies;
  });
  
  const [currentCompany, setCurrentCompany] = useState<Company | null>(() => {
    const savedCurrentCompany = localStorage.getItem('currentCompany');
    return savedCurrentCompany ? JSON.parse(savedCurrentCompany) : companies[0] || null;
  });

  // Save companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  // Save current company to localStorage whenever it changes
  useEffect(() => {
    if (currentCompany) {
      localStorage.setItem('currentCompany', JSON.stringify(currentCompany));
    }
  }, [currentCompany]);

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCompanies(prev => [...prev, newCompany]);
    
    if (!currentCompany) {
      setCurrentCompany(newCompany);
    }
    
    toast.success(`Company "${newCompany.name}" created`);
  };

  const updateCompany = (id: string, companyData: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id 
          ? { ...company, ...companyData, updatedAt: new Date() } 
          : company
      )
    );

    // Update current company if it's the one being updated
    if (currentCompany?.id === id) {
      setCurrentCompany(prev => prev ? { ...prev, ...companyData, updatedAt: new Date() } : null);
    }
    
    toast.success("Company updated");
  };

  const deleteCompany = (id: string) => {
    // Get the company name before deletion
    const companyToDelete = companies.find(company => company.id === id);
    
    // Remove company
    setCompanies(prev => prev.filter(company => company.id !== id));
    
    // If we deleted the current company, set a new one
    if (currentCompany?.id === id) {
      const remaining = companies.filter(company => company.id !== id);
      setCurrentCompany(remaining.length > 0 ? remaining[0] : null);
    }
    
    toast.success(`Company "${companyToDelete?.name}" deleted`);
  };

  const incrementInvoiceCounter = () => {
    if (currentCompany) {
      const updatedCompany = {
        ...currentCompany,
        invoiceCounter: currentCompany.invoiceCounter + 1,
        updatedAt: new Date()
      };
      
      // Update in companies list
      setCompanies(prev => 
        prev.map(company => 
          company.id === currentCompany.id ? updatedCompany : company
        )
      );
      
      // Update current company
      setCurrentCompany(updatedCompany);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        currentCompany,
        setCurrentCompany,
        addCompany,
        updateCompany,
        deleteCompany,
        incrementInvoiceCounter,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
