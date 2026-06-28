import * as XLSX from 'xlsx';

/**
 * Downloads a simple array of objects as an Excel file.
 */
export function exportToExcel(data: Record<string, unknown>[], filename: string, fallbackHeaders?: string[]) {
  let worksheet;
  if (data.length === 0 && fallbackHeaders && fallbackHeaders.length > 0) {
    worksheet = XLSX.utils.aoa_to_sheet([fallbackHeaders]);
  } else {
    worksheet = XLSX.utils.json_to_sheet(data);
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Parses an Excel file and returns JSON data.
 */
export function importFromExcel(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json as Record<string, unknown>[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

/**
 * Downloads an empty Excel template based on headers
 */
export function downloadExcelTemplate(headers: string[], filename: string) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
