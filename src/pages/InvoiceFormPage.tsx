
import { useParams, useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useInvoice } from "@/context/InvoiceContext";
import { useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";

const InvoiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const { currentCompany } = useCompany();
  const navigate = useNavigate();
  
  // If no company is selected, redirect to settings
  useEffect(() => {
    if (!currentCompany) {
      navigate("/settings");
    }
  }, [currentCompany, navigate]);
  
  // If ID is provided, find the invoice to edit
  const invoiceToEdit = id ? invoices.find(inv => inv.id === id) : undefined;

  return (
    <AppLayout>
      <InvoiceForm invoiceToEdit={invoiceToEdit} />
    </AppLayout>
  );
};

export default InvoiceFormPage;
