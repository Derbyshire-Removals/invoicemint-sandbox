
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  actionLabel = "Create",
  icon
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px] border border-dashed rounded-lg bg-secondary/20"
    >
      {icon ? (
        <div className="w-16 h-16 text-muted-foreground mb-4 opacity-50">
          {icon}
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <PlusCircle className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
