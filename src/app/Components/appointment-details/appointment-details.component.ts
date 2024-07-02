import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DateService } from '../../Shared/date.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent implements OnInit {
  constructor(private route:ActivatedRoute, private dateService: DateService) {}
  date: any[] = []
  appointments = JSON.parse(localStorage.getItem('appointments') || "[]")
  matchingappointments: any[] = []
  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.date = params['id'].split('-')
        this.appointments = JSON.parse(localStorage.getItem('appointments') || "[]")
        this.appointments.forEach((app:any) => {
          if (app.startDate == new Date(this.date[0], this.date[1]-1, this.date[2]).toISOString()) {
            this.matchingappointments.push(app)
          }
        })
        console.log(this.matchingappointments)
      }
    )
  }
  getDateString(isoString: string) {
    let date = new Date(isoString)
    return `${this.dateService.daysofweek[date.getDay()]}, ${this.dateService.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
}
