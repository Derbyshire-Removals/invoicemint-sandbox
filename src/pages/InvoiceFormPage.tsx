
import { useParams, useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useInvoice } from "@/context/InvoiceContext";
import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Invoice } from "@/types";

const InvoiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const { currentCompany } = useCompany();
  const navigate = useNavigate();
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | undefined>(undefined);
  
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
      setInvoiceToEdit(invoice);
    }
  }, [id, invoices]);

  // Add debugging to see if this component is rendering properly
  console.log("InvoiceFormPage rendering", { id, invoiceToEdit, currentCompany });

  return (
    <AppLayout>
      <InvoiceForm invoiceToEdit={invoiceToEdit} />
    </AppLayout>
  );
};

export default InvoiceFormPage;
