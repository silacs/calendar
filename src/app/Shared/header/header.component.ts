import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DateService } from '../date.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor() {}
  DateService = inject(DateService)
  get date() {
    return this.DateService.date
  }
  set date(value: Date) {
    this.DateService.changeDate(value)
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
  changeMonth(direction: string) {
    if (direction == 'back') {
      this.date = new Date(this.year, this.month-1, this.day)
    } else if (direction == 'forw') {
      this.date = new Date(this.year, this.month+1, this.day)
    } else {
      console.error("Invalid direction")
    }
  }
}
