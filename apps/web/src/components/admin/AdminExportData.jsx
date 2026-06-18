import React, { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const AdminExportData = ({ data, filename = 'export' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export CSV réussi");
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    if (!data || data.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export JSON réussi");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-[hsl(var(--admin-border))]">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--admin-foreground))]">Exporter les données</DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-muted-foreground))]">
            Choisissez le format d'export pour les {data?.length || 0} enregistrements actuels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2 border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-muted))]"
            onClick={handleExportCSV}
          >
            <FileText className="w-8 h-8 text-[hsl(var(--admin-primary))]" />
            Format CSV
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2 border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-muted))]"
            onClick={handleExportJSON}
          >
            <FileJson className="w-8 h-8 text-[hsl(var(--admin-accent))]" />
            Format JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminExportData;