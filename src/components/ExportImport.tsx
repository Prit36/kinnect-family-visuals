
import React, { useRef } from 'react';
import { Download, Upload, FileJson, Image, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const ExportImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, importData } = useFamilyTreeStore();
  const { toast } = useToast();

  const handleExportJSON = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Family tree data has been exported as JSON",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export family tree data",
        variant: "destructive",
      });
    }
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importData(data);
        toast({
          title: "Import Successful",
          description: "Family tree data has been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import family tree data. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleShareLink = () => {
    const data = exportData();
    const encodedData = encodeURIComponent(data);
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Family Tree',
        text: 'Check out my family tree!',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Shareable link has been copied to clipboard",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share size={16} className="mr-2" />
            Export/Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportJSON}>
            <Download size={16} className="mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportJSON}>
            <Upload size={16} className="mr-2" />
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShareLink}>
            <Share size={16} className="mr-2" />
            Share Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  );
};

export default ExportImport;
