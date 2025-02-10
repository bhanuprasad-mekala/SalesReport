import { Component } from '@angular/core';
import { ExcelService } from '../excel.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {
  salesByRegion: any = [];
  Peoples: any = [];
  Orders: any = [];
  isLoading: boolean = true;
  constructor(private excelService: ExcelService) { }
  ngOnInit() {
    this.excelService.excelData$.subscribe((data) => {
      this.Peoples = data['People'];
      this.Orders = data['Orders'];
    })
    const interval = setInterval(() => {
      if (this.Peoples.length && this.Orders.length) {
        clearInterval(interval);
        this.isLoading = false;
        for (let i = 0; i < this.Orders.length; i++) {
          let region = this.Orders[i].Region;
          if (this.salesByRegion[region]) {
            this.salesByRegion[region] += 1;
          } else {
            this.salesByRegion[region] = 1;
          }
        }
        this.Peoples.forEach((people: any) => {
          people.Sales = this.salesByRegion[people.Region];
        })
        console.log(this.salesByRegion);
        console.log(this.Orders);
        console.log(this.Peoples);
      }
    }, 500);
  }
}
