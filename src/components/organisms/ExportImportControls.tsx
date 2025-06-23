
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
import { useFamilyTree } from '../../hooks/useFamilyTree';
import { ExportService } from '../../services/exportService';

interface ExportImportControlsProps {
  className?: string;
}

export const ExportImportControls: React.FC<ExportImportControlsProps> = ({
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, importData, shareData } = useFamilyTree();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await ExportService.importFromJSON(file);
        importData(data.people, data.relationships);
      } catch (error) {
        console.error('Import failed:', error);
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
          <DropdownMenuItem onClick={exportData}>
            <Download size={16} className="mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload size={16} className="mr-2" />
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={shareData}>
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
