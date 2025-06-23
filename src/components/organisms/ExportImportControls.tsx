
/**
 * Export and import controls component
 */

import React, { useRef } from 'react';
import { Download, Upload, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useFamilyTreeStore } from '../../stores/familyTreeStore';
import { ExportService } from '../../services/exportService';
import { useToast } from '../../hooks/use-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';

interface ExportImportControlsProps {
  className?: string;
}

export const ExportImportControls: React.FC<ExportImportControlsProps> = ({
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, importData } = useFamilyTreeStore();
  const { toast } = useToast();

  const handleExportData = async () => {
    try {
      const { people, relationships } = exportData();
      ExportService.exportAsJSON(people, relationships);
      
      toast({
        title: SUCCESS_MESSAGES.DATA_EXPORTED,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
        variant: "destructive",
      });
    }
  };

  const handleShareData = async () => {
    try {
      const { people, relationships } = exportData();
      await ExportService.copyShareableLink(people, relationships);
      
      toast({
        title: SUCCESS_MESSAGES.LINK_COPIED,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await ExportService.importFromJSON(file);
        importData(data.people, data.relationships);
        
        toast({
          title: SUCCESS_MESSAGES.DATA_IMPORTED,
        });
      } catch (error) {
        console.error('Import failed:', error);
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
          variant: "destructive",
        });
      }
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share size={16} className="mr-2" />
            Export/Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportData}>
            <Download size={16} className="mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload size={16} className="mr-2" />
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShareData}>
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
    </div>
  );
};
