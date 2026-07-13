'use client';

import { Button } from '@/components/ui/button';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ReceiptPDF } from './ReceiptPDF';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye } from 'lucide-react';

interface ReceiptData {
  receiptNumber: string;
  date: string;
  emitter: {
    name: string;
    rfc?: string;
    address: string;
    phone?: string;
    email?: string;
  };
  client: {
    name: string;
    rfc?: string;
    address?: string;
    email?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  iva?: number;
  total: number;
  paymentMethod: string;
}

interface ReceiptDownloaderProps {
  receiptData: ReceiptData;
}

export function ReceiptDownloader({ receiptData }: ReceiptDownloaderProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Ver Recibo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl h-[90vh]">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vista Previa del Recibo</h2>
              <PDFDownloadLink
                document={<ReceiptPDF data={receiptData} />}
                fileName={`recibo-${receiptData.receiptNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button size="sm" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? 'Generando...' : 'Descargar'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="100%">
                <ReceiptPDF data={receiptData} />
              </PDFViewer>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PDFDownloadLink
        document={<ReceiptPDF data={receiptData} />}
        fileName={`recibo-${receiptData.receiptNumber}.pdf`}
      >
        {({ loading }) => (
          <Button size="sm" disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Generando...' : 'Descargar Recibo'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
