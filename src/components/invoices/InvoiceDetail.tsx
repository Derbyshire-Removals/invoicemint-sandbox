
import { useNavigate, useParams } from "react-router-dom";
import { useInvoice } from "@/context/InvoiceContext";
import { useCompany } from "@/context/CompanyContext";
import { PageTransition } from "../ui-custom/PageTransition";
import { StatusBadge } from "../ui-custom/StatusBadge";
import { format } from "date-fns";
import { ArrowLeft, Download, Edit, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export function InvoiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const { companies } = useCompany();
  
  // Find the invoice
  const invoice = invoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The invoice you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  // Find the company
  const company = companies.find(comp => comp.id === invoice.companyId);
  
  if (!company) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The company associated with this invoice doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/invoices")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => navigate(`/invoices/${invoice.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-lg print:shadow-none">
          <CardHeader className="pb-6 pt-8 px-8 border-b">
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Invoice</h1>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>{invoice.invoiceNumber}</p>
                  <p>Issue Date: {format(new Date(invoice.date), "MMMM d, yyyy")}</p>
                  <p>Due Date: {format(new Date(invoice.dueDate), "MMMM d, yyyy")}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={invoice.status} className="mb-2" />
                <div className="text-sm font-semibold">{company.name}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {company.address}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Bill To:</h2>
                <div className="font-medium">{invoice.customer.name}</div>
                <div className="text-muted-foreground whitespace-pre-line">{invoice.customer.address}</div>
                {invoice.customer.email && <div className="text-muted-foreground mt-1">{invoice.customer.email}</div>}
                {invoice.customer.phone && <div className="text-muted-foreground">{invoice.customer.phone}</div>}
              </div>
              <div className="text-right">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Amount Due:</h2>
                <div className="text-3xl font-bold">${invoice.total.toFixed(2)}</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t p-8 text-center text-sm text-muted-foreground">
            Thank you for your business!
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
}
