
import { useParams } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useInvoice } from "@/context/InvoiceContext";

const InvoiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  
  // If ID is provided, find the invoice to edit
  const invoiceToEdit = id ? invoices.find(inv => inv.id === id) : undefined;

  return (
    <AppLayout>
      <InvoiceForm invoiceToEdit={invoiceToEdit} />
    </AppLayout>
  );
};

export default InvoiceFormPage;
