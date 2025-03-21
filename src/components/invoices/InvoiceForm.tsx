import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { useInvoice } from "@/context/InvoiceContext";
import { PageTransition } from "../ui-custom/PageTransition";
import { Invoice, InvoiceItem } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  date: z.date({
    required_error: "Invoice date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    address: z.string().min(1, "Customer address is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().positive(),
      unitPrice: z.coerce.number().nonnegative(),
      total: z.coerce.number(),
    })
  ),
  taxRate: z.coerce.number().min(0).max(100),
  notes: z.string().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  invoiceToEdit?: Invoice;
}

export function InvoiceForm({ invoiceToEdit }: InvoiceFormProps) {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const { addInvoice, updateInvoice, calculateTotals, createEmptyInvoiceItem } = useInvoice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  const isEditing = !!invoiceToEdit;

  const currencySymbol = currentCompany?.currency || "$";

  const defaultDate = new Date();
  
  const getDefaultDueDate = () => {
    if (invoiceToEdit?.dueDate) {
      return new Date(invoiceToEdit.dueDate);
    } else if (currentCompany?.paymentTerms) {
      return addDays(new Date(), currentCompany.paymentTerms);
    } else {
      return addDays(new Date(), 30);
    }
  };

  const defaultValues: FormValues = {
    companyId: currentCompany?.id || "",
    date: invoiceToEdit?.date ? new Date(invoiceToEdit.date) : defaultDate,
    dueDate: getDefaultDueDate(),
    customer: {
      name: invoiceToEdit?.customer.name || "",
      address: invoiceToEdit?.customer.address || "",
      email: invoiceToEdit?.customer.email || "",
      phone: invoiceToEdit?.customer.phone || "",
    },
    items: invoiceToEdit?.items || [createEmptyInvoiceItem()],
    taxRate: invoiceToEdit?.taxRate || 0,
    notes: invoiceToEdit?.notes || (currentCompany?.notes || ""),
    status: invoiceToEdit?.status || "draft",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  useEffect(() => {
    if (currentCompany && !form.getValues("companyId")) {
      form.setValue("companyId", currentCompany.id);
    }
  }, [currentCompany, form]);
  
  const invoiceDate = form.watch("date");
  
  useEffect(() => {
    if (!isEditing && currentCompany?.paymentTerms && invoiceDate) {
      const newDueDate = addDays(new Date(invoiceDate), currentCompany.paymentTerms);
      form.setValue("dueDate", newDueDate);
    }
  }, [invoiceDate, currentCompany?.paymentTerms, form, isEditing]);
  
  const items = form.watch("items");
  const taxRate = form.watch("taxRate");
  
  useEffect(() => {
    const itemsWithTotals = items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    })) as InvoiceItem[];
    
    form.setValue("items", itemsWithTotals);
    
    const { subtotal, taxAmount, total } = calculateTotals(itemsWithTotals, taxRate);
    setSubtotal(subtotal);
    setTaxAmount(taxAmount);
    setTotal(total);
  }, [items, taxRate, calculateTotals, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const typedItems: InvoiceItem[] = data.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      }));
      
      if (isEditing && invoiceToEdit) {
        updateInvoice(invoiceToEdit.id, {
          companyId: data.companyId,
          date: data.date,
          dueDate: data.dueDate,
          customer: {
            name: data.customer.name,
            address: data.customer.address,
            email: data.customer.email || "",
            phone: data.customer.phone || ""
          },
          items: typedItems,
          subtotal,
          taxRate: data.taxRate,
          taxAmount,
          total,
          notes: data.notes,
          status: data.status
        });
      } else {
        addInvoice({
          companyId: data.companyId,
          date: data.date,
          dueDate: data.dueDate,
          customer: {
            name: data.customer.name,
            address: data.customer.address,
            email: data.customer.email || "",
            phone: data.customer.phone || ""
          },
          items: typedItems,
          subtotal,
          taxRate: data.taxRate,
          taxAmount,
          total,
          notes: data.notes,
          status: data.status
        });
      }
      
      navigate("/invoices");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, createEmptyInvoiceItem()]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

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

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Invoice" : "Create New Invoice"}
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/invoices")}
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Invoice Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customer.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Customer address"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customer.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm p-2">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price ({currencySymbol})</div>
                  <div className="col-span-2">Total ({currencySymbol})</div>
                  <div className="col-span-1"></div>
                </div>

                <Separator />

                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Item description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.total`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                readOnly
                                value={field.value.toFixed(2)}
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
              <CardFooter>
                <div className="ml-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium mr-8">Subtotal:</span>
                    <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm">Tax Rate:</span>
                    <div className="w-20">
                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                className="h-8"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <span>%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium mr-8">Tax:</span>
                    <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="mr-8">Total:</span>
                    <span>{currencySymbol}{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes to your invoice"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/invoices")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isEditing ? "Update Invoice" : "Create Invoice"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </PageTransition>
  );
}
