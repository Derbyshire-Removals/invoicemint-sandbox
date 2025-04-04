
import { useParams, useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useInvoice } from "@/context/InvoiceContext";
import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Invoice, InvoiceItem } from "@/types";

const InvoiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const { currentCompany } = useCompany();
  const navigate = useNavigate();
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | undefined>(undefined);
  const isEditing = !!id;
  
  // If no company is selected, redirect to settings
  useEffect(() => {
    if (!currentCompany) {
      navigate("/settings");
    }
  }, [currentCompany, navigate]);
  
  // If ID is provided, find the invoice to edit
  useEffect(() => {
    if (id && invoices.length > 0) {
      const invoice = invoices.find(inv => inv.id === id);
      
      if (invoice) {
        console.log("Found invoice to edit:", invoice);
        
        // Deep copy and explicitly convert each property to ensure correct types
        const formattedItems: InvoiceItem[] = invoice.items.map(item => {
          // Log each item before processing to help debug
          console.log("Processing item:", JSON.stringify(item));
          
          return {
            id: item.id,
            description: item.description || '',
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.total)
          };
        });
        
        console.log("Formatted items for edit:", formattedItems);
        
        // Create a new object with properly formatted data
        const formattedInvoice: Invoice = {
          ...invoice,
          items: formattedItems
        };
        
        console.log("Setting invoiceToEdit with formatted data:", formattedInvoice);
        setInvoiceToEdit(formattedInvoice);
      } else {
        // If invoice not found with this ID, redirect to invoices list
        console.log(`Invoice with ID ${id} not found, redirecting`);
        navigate("/invoices");
      }
    }
  }, [id, invoices, navigate]);

  // Add debugging to see if this component is rendering properly
  console.log("InvoiceFormPage rendering", { id, invoiceToEdit, currentCompany, isEditing });

  return (
    <AppLayout>
      <InvoiceForm 
        invoiceToEdit={invoiceToEdit} 
        isEditing={isEditing} 
      />
    </AppLayout>
  );
};

export default InvoiceFormPage;
