
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
        
        // Create a fully new object with properly typed values for each property
        const formattedItems: InvoiceItem[] = invoice.items.map(item => {
          // Log each item to help debug
          console.log("Processing item:", item);
          
          return {
            id: String(item.id),
            description: String(item.description || ''),
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.total)
          };
        });
        
        console.log("Formatted items for edit:", formattedItems);
        
        // Create a deep clone of the invoice with formatted data
        const formattedInvoice: Invoice = {
          ...invoice,
          companyId: String(invoice.companyId),
          invoiceNumber: String(invoice.invoiceNumber),
          date: new Date(invoice.date),
          dueDate: new Date(invoice.dueDate),
          customer: {
            name: String(invoice.customer.name),
            address: String(invoice.customer.address),
            email: String(invoice.customer.email || ''),
            phone: String(invoice.customer.phone || '')
          },
          items: formattedItems,
          subtotal: Number(invoice.subtotal),
          taxRate: Number(invoice.taxRate),
          taxAmount: Number(invoice.taxAmount),
          total: Number(invoice.total),
          status: invoice.status,
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt)
        };
        
        console.log("Setting invoiceToEdit with fully formatted data:", formattedInvoice);
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
