
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { useInvoice } from "@/context/InvoiceContext";
import { PageTransition } from "../ui-custom/PageTransition";
import { EmptyState } from "../ui-custom/EmptyState";
import { FileText, PlusCircle, FileSearch, Printer, Download, Search, Pencil } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "../ui-custom/StatusBadge";
import { Invoice } from "@/types";
import { printInvoice } from "@/utils/printUtils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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

export function InvoiceList() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const { invoices, getInvoicesByCompany, deleteInvoice } = useInvoice();
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!currentCompany) {
    return (
      <PageTransition>
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Company Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a company first.
          </p>
          <Button onClick={() => navigate("/settings")}>
            Go to Company Settings
          </Button>
        </div>
      </PageTransition>
    );
  }

  const companyInvoices = getInvoicesByCompany(currentCompany.id);
  
  const filteredInvoices = companyInvoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.customer.name.toLowerCase().includes(searchLower) ||
      String(invoice.total).includes(searchTerm)
    );
  });

  const currencySymbol = currentCompany.currency || "$";

  const handleCreateInvoice = () => {
    navigate("/invoices/new");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log("Navigating to edit invoice:", invoice.id);
    navigate(`/invoices/${invoice.id}/edit`);
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      const company = currentCompany;
      printInvoice(invoice, company);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button onClick={handleCreateInvoice}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        {companyInvoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Create your first invoice to get started."
            action={handleCreateInvoice}
            actionLabel="Create Invoice"
            icon={<FileText className="w-full h-full" />}
          />
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Invoices</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileSearch className="h-8 w-8 mb-2" />
                          <p>No invoices found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="cursor-pointer"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{invoice.customer.name}</TableCell>
                        <TableCell>{currencySymbol}{invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewInvoice(invoice);
                              }}>
                                <FileText className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEditInvoice(invoice);
                              }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handlePrintInvoice(invoice.id);
                              }}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                              }}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete invoice {invoice.invoiceNumber}.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground"
                                      onClick={() => handleDeleteInvoice(invoice.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
