
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompany } from "@/context/CompanyContext";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Company } from "@/types";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  invoiceCounter: z.coerce.number().int().positive(),
  currency: z.string().min(1, "Currency is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  companyToEdit?: Company;
  onSuccess?: () => void;
}

export function CompanyForm({ companyToEdit, onSuccess }: CompanyFormProps) {
  const { addCompany, updateCompany } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!companyToEdit;

  // Default values for the form
  const defaultValues: FormValues = {
    name: companyToEdit?.name || "",
    address: companyToEdit?.address || "",
    invoicePrefix: companyToEdit?.invoicePrefix || "",
    invoiceCounter: companyToEdit?.invoiceCounter || 1,
    currency: companyToEdit?.currency || "$",
    notes: companyToEdit?.notes || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && companyToEdit) {
        updateCompany(companyToEdit.id, data);
      } else {
        // Make sure all required fields are present
        const newCompany: Omit<Company, "id" | "createdAt" | "updatedAt"> = {
          name: data.name,
          address: data.address,
          invoicePrefix: data.invoicePrefix,
          invoiceCounter: data.invoiceCounter,
          currency: data.currency,
          notes: data.notes || "",
        };
        addCompany(newCompany);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Company" : "Add New Company"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update your company details below."
            : "Add a new company to manage its invoices."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="123 Business St, City, Country"
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
              name="invoicePrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceCounter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Counter</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Thank you for your business!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Update Company" : "Add Company"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
