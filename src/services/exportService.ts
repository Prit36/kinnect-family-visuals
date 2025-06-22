/**
 * Export/Import service for family tree data
 */

import { Person, Relationship, ExportData } from '../types';
import { createExportData, validateImportData, generateShareableUrl } from '../utils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

export class ExportService {
  /**
   * Export family tree data as JSON
   */
  static exportAsJSON(people: Person[], relationships: Relationship[]): void {
    try {
      const exportData = createExportData(people, relationships);
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR);
    }
  }

  /**
   * Import family tree data from JSON
   */
  static async importFromJSON(file: File): Promise<ExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (!validateImportData(data)) {
            reject(new Error(ERROR_MESSAGES.IMPORT.INVALID_FORMAT));
            return;
          }
          
          resolve(data);
        } catch (error) {
          reject(new Error(ERROR_MESSAGES.IMPORT.CORRUPTED_DATA));
        }
      };
      
      reader.onerror = () => {
        reject(new Error(ERROR_MESSAGES.GENERAL.NETWORK_ERROR));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Generate shareable link
   */
  static generateShareableLink(people: Person[], relationships: Relationship[]): string {
    try {
      const exportData = createExportData(people, relationships);
      const dataStr = JSON.stringify(exportData);
      return generateShareableUrl(dataStr);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR);
    }
  }

  /**
   * Copy shareable link to clipboard
   */
  static async copyShareableLink(people: Person[], relationships: Relationship[]): Promise<void> {
    try {
      const shareUrl = this.generateShareableLink(people, relationships);
      
      if (navigator.share) {
        await navigator.share({
          title: 'Family Tree',
          text: 'Check out my family tree!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (error) {
      throw new Error(ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR);
    }
  }

  /**
   * Export as image (placeholder for future implementation)
   */
  static exportAsImage(): void {
    // TODO: Implement image export functionality
    throw new Error('Image export not yet implemented');
  }

  /**
   * Export as PDF (placeholder for future implementation)
   */
  static exportAsPDF(): void {
    // TODO: Implement PDF export functionality
    throw new Error('PDF export not yet implemented');
  }
}