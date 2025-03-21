
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCompany } from "@/context/CompanyContext";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export function NavBar() {
  const { currentCompany } = useCompany();

  return (
    <header className="h-16 border-b flex items-center px-4 gap-4">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
          <FileText className="h-4 w-4" />
        </div>
        <motion.span 
          key={currentCompany?.id} 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg"
        >
          {currentCompany ? currentCompany.name : "InvoiceMint"}
        </motion.span>
      </div>
    </header>
  );
}
