
import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { useNavigate, useLocation } from "react-router-dom";

export function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany } = useCompany();
  const [open, setOpen] = useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCompanyChange = (company) => {
    setCurrentCompany(company);
    setOpen(false);
    
    // Navigate to dashboard if not already there, or just stay on the dashboard to refresh data
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  if (!companies.length) {
    return (
      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-[280px] justify-between">
            <span>Create your first company</span>
            <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <CompanyForm onSuccess={() => setShowNewCompanyDialog(false)} />
      </Dialog>
    );
  }

  return (
    <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a company"
            className="w-[280px] justify-between"
          >
            {currentCompany?.name || "Select company..."}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search company..." />
              <CommandEmpty>No company found.</CommandEmpty>
              <CommandGroup heading="Companies">
                {companies.map((company) => (
                  <CommandItem
                    key={company.id}
                    className="text-sm"
                    onSelect={() => handleCompanyChange(company)}
                  >
                    <span>{company.name}</span>
                    {currentCompany?.id === company.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewCompanyDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Company
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CompanyForm onSuccess={() => setShowNewCompanyDialog(false)} />
    </Dialog>
  );
}
