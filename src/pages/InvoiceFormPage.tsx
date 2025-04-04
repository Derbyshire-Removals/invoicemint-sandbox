
import { useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCompany } from "@/context/CompanyContext";
import { useEffect } from "react";

const InvoiceFormPage = () => {
  const { currentCompany } = useCompany();
  const navigate = useNavigate();
  
  // If no company is selected, redirect to settings
  useEffect(() => {
    if (!currentCompany) {
      navigate("/settings");
    }
  }, [currentCompany, navigate]);

  console.log("InvoiceFormPage rendering", { currentCompany });

  return (
    <AppLayout>
      <InvoiceForm />
    </AppLayout>
  );
};

export default InvoiceFormPage;
