import { Component, inject } from '@angular/core';
import { DateService } from '../../Shared/date.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-editappointments',
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
  templateUrl: './editappointments.component.html',
  styleUrl: './editappointments.component.scss'
})
export class EditappointmentsComponent {
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
  appointments = JSON.parse(localStorage.getItem('appointments') || "[]")
  uuid = 0
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
        this.uuid = res['uuid']
        this.appointments.forEach((app:any) => {
          if(app.uuid == this.uuid){
            this.form = this.fb.group({
              title: [app.title, Validators.required],
              startDate: [new Date(app.startDate), Validators.required],
              startTime: [app.startTime, [
                Validators.required,
                Validators.pattern(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/)]],
              endDate: [new Date(app.endDate), Validators.required],
              endTime: [app.endTime, [
                Validators.required,
                Validators.pattern(/^([0-1][0-9]|2[0-4]):[0-5][0-9]$/)]],
              description: [app.description, Validators.maxLength(240)],
              uuid: [app.uuid]
            })
          }
        })
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
    if (!alreadyExists) {
      appointments.forEach((app:any, index:number) => {
        if (app.uuid == this.form.value.uuid) {
          appointments[index] = this.form.value
        }
      })
      console.log(appointments)
      localStorage.setItem('appointments', JSON.stringify(appointments))
      this.form.reset()
      alert("Successfully booked appointment")
    } else {
      alert("This appointment is already booked")
    }
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
