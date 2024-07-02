import { Component, OnInit, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { DateService } from '../../Shared/date.service';
import { Y } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatGridListModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  dateService = inject(DateService)
  get date() {
    return this.dateService.date
  }
  set date(value: Date) {
    this.dateService.changeDate(this.date)
  }
  get year() {
    return this.date.getFullYear()
  }
  get month() {
    return this.date.getMonth()
  }
  get day() {
    return this.date.getDate()
  }
  get fdom() {
    return new Date(this.year, this.month, 1).getDay() == 0 ? 7 : new Date(this.year, this.month, 1).getDay()
  }
  days: Date[] = []
  ngOnInit(): void {
    this.getDaysInMonth()
    this.dateService.change$.subscribe(
      res => {
        this.days = []
        this.getDaysInMonth()
      }
    )
  }
  //Days In Month (Takes in non-zero indexed months)
  dim(month:number, year:number) {
    return new Date(year, month, 0).getDate()
  }
  getDaysInMonth() {
    if (this.fdom != 1) {
      let dipm = this.dim(this.month, this.year)
      for(let i = dipm-(this.fdom-2); i <= dipm; i++) {
        this.days.push(new Date(this.year, this.month-1, i));
      }
    }
    for (let i = 1; i <= this.dim(this.month+1, this.year); i++){
      this.days.push(new Date(this.year, this.month, i))
    }
    let ldom = new Date(this.year, this.month, this.dim(this.month+1, this.year)).getDay()
    if (ldom != 0) {
      for (let i = 1; i <= 7-ldom; i++) {
        this.days.push(new Date(this.year, this.month+1, i))
      }
    }
  }
}
