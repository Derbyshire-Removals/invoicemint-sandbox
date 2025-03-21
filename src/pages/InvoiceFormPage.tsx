
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
      <div className="max-w-5xl mx-auto">
        <InvoiceForm invoiceToEdit={invoiceToEdit} />
      </div>
    </AppLayout>
  );
};

export default InvoiceFormPage;
