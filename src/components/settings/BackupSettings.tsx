import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/context/CompanyContext";
import { useInvoice } from "@/context/InvoiceContext";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";

export function BackupSettings() {
  const { companies } = useCompany();
  const { invoices } = useInvoice();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    try {
      const backupData = {
        companies,
        invoices,
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `invoice-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        
        if (!backupData.companies || !backupData.invoices) {
          throw new Error("Invalid backup file format");
        }

        // Store the imported data
        localStorage.setItem('companies', JSON.stringify(backupData.companies));
        localStorage.setItem('invoices', JSON.stringify(backupData.invoices));
        
        toast.success("Data imported successfully. Please refresh the page to see changes.");
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>
          Export your data for backup or import from a previous backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={exportData} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importData}
          className="hidden"
        />
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Export:</strong> Downloads all your companies and invoices as a JSON file.</p>
          <p><strong>Import:</strong> Restores data from a backup file. This will replace your current data.</p>
          <p className="text-amber-600"><strong>Warning:</strong> Importing will overwrite all existing data. Make sure to export current data first if needed.</p>
        </div>
      </CardContent>
    </Card>
  );
}