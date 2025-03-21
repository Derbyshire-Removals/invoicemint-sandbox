import { useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { useInvoice } from "@/context/InvoiceContext";
import { PageTransition } from "../ui-custom/PageTransition";
import { EmptyState } from "../ui-custom/EmptyState";
import { FileText, PlusCircle, Building, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "../ui-custom/StatusBadge";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const navigate = useNavigate();
  const { currentCompany, companies } = useCompany();
  const { invoices, getInvoicesByCompany } = useInvoice();
  
  if (companies.length === 0) {
    return (
      <PageTransition>
        <EmptyState
          title="Welcome to InvoiceMint"
          description="Get started by creating your first company profile."
          action={() => navigate("/settings")}
          actionLabel="Create Company"
          icon={<Building className="w-full h-full" />}
        />
      </PageTransition>
    );
  }
  
  if (!currentCompany) {
    return (
      <PageTransition>
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Company Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select a company to view its dashboard.
          </p>
          <Button onClick={() => navigate("/settings")}>
            Go to Company Settings
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  const companyInvoices = getInvoicesByCompany(currentCompany.id);
  const recentInvoices = [...companyInvoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  const totalInvoices = companyInvoices.length;
  const totalAmount = companyInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = companyInvoices.filter(inv => inv.status === 'paid');
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueInvoices = companyInvoices.filter(inv => inv.status === 'overdue');
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
  
  const currencySymbol = currentCompany.currency || "$";

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/invoices/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {totalInvoices === 1 ? "Invoice" : "Invoices"} created
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencySymbol}{totalAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencySymbol}{paidAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {paidInvoices.length} paid {paidInvoices.length === 1 ? "invoice" : "invoices"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-500">
                Overdue
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-red-500"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {currencySymbol}{overdueAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {overdueInvoices.length} overdue {overdueInvoices.length === 1 ? "invoice" : "invoices"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Your latest {recentInvoices.length} invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No invoices created yet</p>
                  </div>
                ) : (
                  recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                          <span className="text-muted-foreground text-sm mx-2">•</span>
                          <StatusBadge status={invoice.status} />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {invoice.customer.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{currencySymbol}{invoice.total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(invoice.date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/invoices")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Current company profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h3>
                  <p>{currentCompany.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                  <p className="whitespace-pre-line">{currentCompany.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Invoice Settings</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm">Prefix</p>
                      <p className="font-medium">{currentCompany.invoicePrefix}</p>
                    </div>
                    <div>
                      <p className="text-sm">Counter</p>
                      <p className="font-medium">{currentCompany.invoiceCounter}</p>
                    </div>
                    <div>
                      <p className="text-sm">Currency</p>
                      <p className="font-medium">{currentCompany.currency || "$"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{currentCompany.notes}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/settings")}
              >
                Edit Company Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
