
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<InvoiceStatus, { text: string; className: string }> = {
    draft: {
      text: "Draft",
      className: "bg-secondary text-secondary-foreground"
    },
    sent: {
      text: "Sent",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    },
    paid: {
      text: "Paid",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    },
    overdue: {
      text: "Overdue",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    }
  };

  const variant = variants[status];

  return (
    <Badge className={cn(variant.className, "font-medium", className)}>
      {variant.text}
    </Badge>
  );
}
