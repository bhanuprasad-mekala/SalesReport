import { Component } from '@angular/core';
import { ExcelService } from '../excel.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  Orders: any[] = [];
  OrdersData: any[] = [];
  headers: any[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  isLoading:boolean=true;
  searchText: string = '';
  constructor(private excelService: ExcelService) { }
  ngOnInit() {
    this.excelService.excelData$.subscribe((data) => {
      this.Orders = data['Orders'];
    })
    const interval = setInterval(() => {
      if (this.Orders.length) {
        clearInterval(interval);
        console.log(this.Orders);
        this.headers = Object.keys(this.Orders[0])
          .filter((header) => header !== 'Row_ID' && header !== 'Customer_ID' && header !== 'Country'
            && header !== 'City' && header !== 'State' && header !== 'Postal_Code' && header !== 'Product_ID')
          .map((header) => header.replace(/_/g, ' '));
        const segmentIndex = this.headers.indexOf('Segment');
        if (segmentIndex !== -1) {
          this.headers.splice(segmentIndex + 1, 0, 'Address');
        }
        this.Orders.forEach((order: any) => {
          order.Address = `${order.City}, ${order.State}, ${order.Country} - ${order.Postal_Code}`;
        })
        this.OrdersData = this.Orders;
        console.log(this.headers);
        console.log(this.OrdersData);
        this.isLoading=false;
      }
    }, 500);
  }

  onSearch() {
    this.OrdersData = this.Orders.filter((order: any) => {
      return Object.values(order).some((value: any) => {
        return String(value).toLowerCase().includes(this.searchText.toLowerCase());
      });
    });
  }
}
