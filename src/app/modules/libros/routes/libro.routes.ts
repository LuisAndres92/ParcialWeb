import { Routes } from '@angular/router';
import { LibroLayout } from '../layouts/libro-layout/libro-layout';
import { LibroPage } from '../pages/libro-page/libro-page';

export const LIBRO_ROUTES: Routes = [
    {
        path: '',
        component: LibroLayout,
        children: [
            {
                path: '',
                component: LibroPage
            }
        ]
    }
];