/**
 * Exports an array of objects to a CSV file and triggers a download.
 * @param data - The array of objects to export.
 * @param filename - The name of the file (without extension).
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    return;
  }

  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Build CSV rows
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape double quotes and wrap in quotes to handle commas in text
      const escaped = ('' + (value ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob and trigger download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
}