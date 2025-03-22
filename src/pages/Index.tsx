
import { useEffect } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCompany } from "@/context/CompanyContext";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { currentCompany } = useCompany();
  const location = useLocation();
  
  // This key will force the Dashboard component to re-render when company changes
  const dashboardKey = `dashboard-${currentCompany?.id || "no-company"}-${location.key}`;
  
  return (
    <AppLayout>
      <Dashboard key={dashboardKey} />
    </AppLayout>
  );
};

export default Index;
