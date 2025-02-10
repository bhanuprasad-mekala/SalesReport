import { Component, OnInit } from '@angular/core';
import { ExcelService } from './excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Excel-Project';
  excelData: any = {}; // Property to store the JSON data

  constructor(private excelService: ExcelService) {}

  ngOnInit() {
    this.adjustZoomLevel();
    this.excelService.ReadExcel();
    window.addEventListener('resize', this.adjustZoomLevel);
  }

  adjustZoomLevel = () => {
    const screenWidth = window.innerWidth;
    let zoomLevel = 1;

    if (screenWidth < 1200) {
      zoomLevel = 0.67;
    } else if (screenWidth < 1600) {
      zoomLevel = 0.75;
    } else if (screenWidth < 1920) {
      zoomLevel = 0.85;
    } else {
      zoomLevel = 1;
    }

    (document.body.style as any).zoom = (zoomLevel * 100) + '%';
  }
}
