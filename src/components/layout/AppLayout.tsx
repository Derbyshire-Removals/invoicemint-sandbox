
import { AnimatePresence } from "framer-motion";
import { NavBar } from "./NavBar";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Home, FileText, Settings, Plus, FileCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { CompanySwitcher } from "../ui-custom/CompanySwitcher";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  
  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Invoices", icon: FileText, path: "/invoices" },
    { label: "New Invoice", icon: Plus, path: "/invoices/new" },
    { label: "Company Settings", icon: Settings, path: "/settings" },
  ];
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="p-4">
            <CompanySwitcher />
          </div>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <NavBar />
          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <div key={location.pathname} className="p-8 max-w-7xl mx-auto w-full">
                {children}
              </div>
            </AnimatePresence>
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
}
