import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../Shared/date.service';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bookappointments',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    MatDatepickerModule
  ],
  templateUrl: './bookappointments.component.html',
  styleUrl: './bookappointments.component.scss'
})
export class BookappointmentsComponent implements OnInit {
  constructor(private route:ActivatedRoute, private fb: FormBuilder) {}
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
  form: FormGroup = this.fb.group({
    title: ["", Validators.required],
    startDate: [this.date, Validators.required],
    startTime: ["", [
      Validators.required,
      Validators.pattern(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/)]],
    endDate: [this.date, Validators.required],
    endTime: ["", [
      Validators.required,
      Validators.pattern(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/)]],
    description: ["", Validators.maxLength(240)],
    uuid: ['']
  })
  ngOnInit(): void {
    this.route.params.subscribe(
      res => {
        console.log('route activated')
        let dateparts = res['id'].split('-')
        this.date = new Date(dateparts[0], dateparts[1]-1, dateparts[2])
      }
    )
  }
  submit() {
    console.log('gio')
    let startDate = this.form.value.startDate.toISOString()
    let endDate = this.form.value.endDate.toISOString()
    let startTime = this.form.controls['startTime']
    let endTime = this.form.controls['endTime']

    let regex = /^([0-1][0-9]|2[0-4]):[0-5][0-9]$/
    if (startDate == endDate) {
      if (startTime.value.match(regex) && endTime.value.match(regex)) {
        let start = startTime.value.split(':');
        let end = endTime.value.split(':');
        console.log(start, end)
        if (start[0] > end[0]) {
          alert("Start time is later than end time")
        } else if (start[0] == end[0]) {
          if (start[1] > end[1]) {
            alert("Start time is later than end time")
          } else {
            this.saveAppointment()
          }
        } else {
          this.saveAppointment()
        }
      }
    } else if (startDate > endDate) {
      alert("Start date is later than end date")
    } else {
      this.saveAppointment()
    }
  }
  saveAppointment() {
    let appointments = JSON.parse(localStorage.getItem('appointments') || "[]")
    let alreadyExists = false
    appointments.forEach((app:any) => {
      if (this.form.value == app) {
        alreadyExists = true;
      }
    })
    // this is just for example, a more precise unique id can be implemented later
    this.form.controls['uuid'].setValue(appointments.length+Math.floor(Math.random() * 1000))
    appointments.forEach((app:any) => {
      if (app.uuid == this.form.value.uuid) {
        this.form.controls['uuid'].setValue(appointments.length+Math.floor(Math.random() * 1000))
      }
    })
    if (!alreadyExists) {
      appointments.push(this.form.value)
      alert("Successfully booked appointment")
    } else {
      alert("This appointment is already booked")
    }
    localStorage.setItem('appointments', JSON.stringify(appointments))
    this.form.reset()
  }
  zeroPad(time: string) {
    console.log(this.form.value)
    if (time == 'start') {
      if (this.form.value.startTime?.length == 4 && this.form.value.startTime.includes(":")) {
        this.form.controls['startTime'].setValue("0" + this.form.value.startTime)
      } else if (this.form.value.startTime.split(':')[0] == 24) {
        this.form.controls['startTime'].setValue("00:" + this.form.value.startTime.split(':')[1])
      }
    } else if (time == 'end') {
      if (this.form.value.endTime?.length == 4 && this.form.value.endTime.includes(":")) {
        this.form.controls['endTime'].setValue("0" + this.form.value.endTime)
      } else if (this.form.value.endTime.split(':')[0] == 24) {
        this.form.controls['endTime'].setValue("00:" + this.form.value.endTime.split(':')[1])
      }
    }
  }
}
