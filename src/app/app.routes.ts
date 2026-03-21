import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'libros',
        loadChildren: () => import('./modules/libros/routes/libro.routes').then(m => m.LIBRO_ROUTES)
    },
    {
        path: '**',
        redirectTo: 'libros'
    }
];
