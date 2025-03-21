import { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { PageTransition } from "../ui-custom/PageTransition";
import { EmptyState } from "../ui-custom/EmptyState";
import { Building, Edit, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "../companies/CompanyForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function CompanySettings() {
  const { companies, currentCompany, setCurrentCompany, deleteCompany } = useCompany();
  const [editCompany, setEditCompany] = useState(null);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  
  const handleEditCompany = (company) => {
    setEditCompany(company);
  };
  
  const handleAddCompany = () => {
    setShowNewCompanyDialog(true);
  };
  
  const handleDeleteCompany = (id) => {
    deleteCompany(id);
    setEditCompany(null);
  };
  
  const handleCompanyFormSuccess = () => {
    setEditCompany(null);
    setShowNewCompanyDialog(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Company Settings</h1>
          <Button onClick={handleAddCompany}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        {companies.length === 0 ? (
          <EmptyState
            title="No companies yet"
            description="Create your first company to get started."
            action={handleAddCompany}
            actionLabel="Add Company"
            icon={<Building className="w-full h-full" />}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card key={company.id} className={`overflow-hidden transition-all duration-200 ${company.id === currentCompany?.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                {company.id === currentCompany?.id && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium py-1 text-center">
                    Current Company
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditCompany(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <CompanyForm
                          companyToEdit={company}
                          onSuccess={handleCompanyFormSuccess}
                        />
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {company.name} and all associated invoices.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleDeleteCompany(company.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {company.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Invoice Prefix:</span>
                      <span className="font-medium">{company.invoicePrefix}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Invoice:</span>
                      <span className="font-medium">
                        {company.invoicePrefix}
                        {company.invoiceCounter.toString().padStart(3, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Terms:</span>
                      <span className="font-medium">{company.paymentTerms} days</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Notes:</p>
                    <p className="line-clamp-2">{company.notes || "No notes added"}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Created {format(new Date(company.createdAt), "MMM d, yyyy")}</span>
                    {company.id !== currentCompany?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCompany(company)}
                      >
                        Switch to this company
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Company Dialog */}
      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <CompanyForm onSuccess={handleCompanyFormSuccess} />
      </Dialog>
    </PageTransition>
  );
}
