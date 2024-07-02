import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () => 
        import('./Components/home/home.component').then(m => m.HomeComponent)},
    {path: 'Appointments', loadComponent: () => 
        import('./Components/appointments/appointments.component').then(m => m.AppointmentsComponent)
    },
    {path: 'Appointments/Book/:id', loadComponent: () => 
        import('./Components/bookappointments/bookappointments.component').then(m => m.BookappointmentsComponent)
    },
    {path: 'Appointments/View/:id', loadComponent: () =>
        import('./Components/appointment-details/appointment-details.component').then(m => m.AppointmentDetailsComponent)
    },
    {path: 'Appointments/Edit/:uuid', loadComponent: () =>
        import('./Components/editappointments/editappointments.component').then(m => m.EditappointmentsComponent)
    }
];
