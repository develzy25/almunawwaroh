import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  yayasanName: string;
  yayasanAddress?: string;
  columns: string[];
  data: (string | number)[][];
  filename: string;
}

export function exportToPDF({ title, yayasanName, yayasanAddress, columns, data, filename }: PDFExportOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header: Yayasan Name & Address
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(yayasanName, pageWidth / 2, 20, { align: 'center' });
  
  if (yayasanAddress) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(yayasanAddress, pageWidth / 2, 26, { align: 'center' });
  }

  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 40, { align: 'center' });

  // Table
  autoTable(doc, {
    startY: 50,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [16, 185, 129] }, // Emerald / Primary Color
    margin: { top: 50 },
  });

  // Footer: Realtime Timestamp
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  const timestamp = new Date().toLocaleString('id-ID', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Dicetak pada: ${timestamp}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  doc.save(`${filename}.pdf`);
}
