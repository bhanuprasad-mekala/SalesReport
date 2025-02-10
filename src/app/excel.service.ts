import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private excelDataSubject = new BehaviorSubject<any>({});
  excelData$ = this.excelDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  ReadExcel() {
    this.http.get('assets/SalesReport.xlsx', { responseType: 'blob' }).subscribe((data: Blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryData = reader.result;
        const workBook = XLSX.read(binaryData, { type: 'binary', cellDates: true, dateNF: 'mm/dd/yyyy' });
        const allSheetData: { [key: string]: any } = workBook.SheetNames.reduce((acc: { [key: string]: any }, sheetName: string) => {
          const sheet = workBook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(sheet, { raw: false, header: 1 });
          const headers = (sheetData[0] as string[]).map((header: string) => header.replace(/[\s-]+/g, '_'));
          const data = (sheetData.slice(1) as any[][]).map((row: any[]) => {
            const rowData: { [key: string]: any } = {};
            headers.forEach((header: string, index: number) => {
              rowData[header] = row[index];
              if (rowData[header] instanceof Date) {
                rowData[header] = this.formatDate(rowData[header]);
              }
            });
            return rowData;
          });
          acc[sheetName] = data;
          return acc;
        }, {});
        this.excelDataSubject.next(allSheetData); // Update the BehaviorSubject with the new data
      };
      reader.readAsBinaryString(data);
    });
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}