import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  date: Date = new Date()
  change$ = new Subject<string>()
  constructor() { }
  changeDate(newDate: Date) {
    this.date = newDate
    this.change$.next("Date Changed!")
  }
  
  daysofweek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
}
