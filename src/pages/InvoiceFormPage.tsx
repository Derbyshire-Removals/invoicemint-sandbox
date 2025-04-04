
import { useNavigate, useParams } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCompany } from "@/context/CompanyContext";
import { useInvoice } from "@/context/InvoiceContext";
import { useEffect, useState } from "react";

const InvoiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentCompany } = useCompany();
  const { getInvoice } = useInvoice();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(id ? getInvoice(id) : undefined);
  const isEditMode = !!id;
  
  // If no company is selected, redirect to settings
  useEffect(() => {
    if (!currentCompany) {
      navigate("/settings");
    }
  }, [currentCompany, navigate]);
  
  // If editing and invoice not found, redirect to invoices
  useEffect(() => {
    if (isEditMode && !invoice) {
      console.error("Invoice not found for editing:", id);
      navigate("/invoices");
    }
  }, [isEditMode, invoice, id, navigate]);

  console.log("InvoiceFormPage rendering", { 
    currentCompany, 
    isEditMode, 
    invoiceId: id,
    invoice 
  });

  return (
    <AppLayout>
      <InvoiceForm initialInvoice={invoice} isEditMode={isEditMode} />
    </AppLayout>
  );
};

export default InvoiceFormPage;
