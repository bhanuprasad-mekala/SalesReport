import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../excel.service';
import { Chart } from 'angular-highcharts';
import { color, SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent implements OnInit {
  excelData: any = [];
  orders: any = [];
  returns: any = [];
  people: any = [];
  salesByRegion: any = {};
  color_pie: any = ['#044342', '#7e0505', '#ed9e20', '#6920fb', '#121212']
  chartSalesByRegion!: Chart;
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  chartMonthWiseSales!: Chart;
  chartSalesByYear!: Chart;

  constructor(private excelService: ExcelService) { }

  ngOnInit() {
    this.excelService.excelData$.subscribe((data) => {
      this.orders = data['Orders'];
      this.returns = data['Returns'];
      this.people = data['People'];
    });

    const interval = setInterval(() => {
      if (this.orders.length && this.returns.length && this.people.length) {
        clearInterval(interval);
        this.getSalesByRegion();
        this.getSalesByYear();
        this.getSalesByYearAndMonth();
        this.getCatergoryWiseSales();
      }
    }, 500); // Check every 500ms
  }

  getSalesByRegion() {
    let totalSoldQuantity = 0;
    let regions: any[] = [];
    let options: any[] = [];
    for (let i = 0; i < this.orders.length; i++) {
      let region = this.orders[i].Region;
      let sales = this.orders[i].Quantity;
      if (this.salesByRegion[region]) {
        this.salesByRegion[region] += Number(sales);
      } else {
        this.salesByRegion[region] = Number(sales);
      }
      totalSoldQuantity += Number(sales);
    }
    for (const region in this.salesByRegion) {
      regions[regions.length] = region;
      this.salesByRegion[region] = Number(((this.salesByRegion[region] / totalSoldQuantity) * 100).toFixed(2));
      options[options.length] = {
        name: region,
        y: this.salesByRegion[region],
        color: this.color_pie[regions.length - 1]
      };
    }
    this.chartSalesByRegion = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Sales by Region'
      },
      xAxis: {
        categories: regions
      },
      yAxis: {
        title: {
          text: 'Sales Percentage'
        }
      },
      series: [{
        type: 'pie',
        data: options
      }],
      credits: {
        enabled: false
      }
    });
  }

  getSalesByYear() {
    let salesByYear: any = {};
    let years: any[] = [];
    for (let i = 0; i < this.orders.length; i++) {
      let year = this.orders[i].Order_Date.split('/')[2];
      let sales = this.orders[i].Quantity;
      if (salesByYear[year]) {
        salesByYear[year] += Number(sales);
      } else {
        salesByYear[year] = Number(sales);
        years[years.length] = Number(year);
      }
    }
    years.sort();
    let options: any = [];
    for (var i in salesByYear) {
      let yearName = i;
      let count = salesByYear[i];
      let data = {
        name: yearName,
        y: count,
        color: this.color_pie[years.indexOf(Number(yearName))]
      }
      options.push(data);
    }
    this.chartSalesByYear = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Sales by Year'
      },
      xAxis: {
        categories: years,
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Quantity Sold'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Sales',
          showInLegend: false,
          data: options
        }
      ]
    })
  }

  getSalesByYearAndMonth() {
    let salesByYearAndMonth: any = {};
    for (let i = 0; i < this.orders.length; i++) {
      let year = this.orders[i].Order_Date.split('/')[2];
      let month = this.orders[i].Order_Date.split('/')[0];
      let sales = this.orders[i].Quantity;
      let monthName = this.getMonthName(month);
      if (salesByYearAndMonth[year]) {
        if (salesByYearAndMonth[year][monthName]) {
          salesByYearAndMonth[year][monthName] += Number(sales);
        } else {
          salesByYearAndMonth[year][monthName] = Number(sales);
        }
      } else {
        salesByYearAndMonth[year] = {};
        salesByYearAndMonth[year][monthName] = Number(sales);
      }
    }
    let options: SeriesOptionsType[] = [];
    for (var year in salesByYearAndMonth) {
      let yearName = year;
      let monthName = '';
      let count = [];
      for (var month in salesByYearAndMonth[year]) {
        monthName = month;
        count.push(salesByYearAndMonth[year][month]);
      }
      let data = {
        name: yearName,
        type: 'line',
        data: count
      }
      options.push(data as SeriesOptionsType);
    }
    this.chartMonthWiseSales = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Sales by Year and Month'
      },
      xAxis: {
        categories: this.monthNames
      },
      yAxis: {
        title: {
          text: 'Quanity sold'
        }
      },
      series: options
    })
  }

  getMonthName(month: string): string {
    return this.monthNames[parseInt(month, 10) - 1];
  }

  getCatergoryWiseSales() {
    let catergoryWiseSales: any = [];
    let categories: any = [];
    let totalSoldQuantity = 0;
    let options:any=[];
    for (let i = 0; i < this.orders.length; i++) {
      let category = this.orders[i].Category;
      let sales = this.orders[i].Quantity;
      if (catergoryWiseSales[category]) {
        catergoryWiseSales[category] += Number(sales);
      } else {
        catergoryWiseSales[category] = Number(sales);
      }
      totalSoldQuantity += Number(sales);
    }
    for (const category in catergoryWiseSales) {
      categories[categories.length] = category;
      catergoryWiseSales[category] = Number(((catergoryWiseSales[category] / totalSoldQuantity) * 100).toFixed(2));
      options[options.length] = {
        name: category,
        y: categories[category],
        color: this.color_pie[category.length - 1]
      };
    }
    console.log(catergoryWiseSales);
    console.log(totalSoldQuantity);
  }
}