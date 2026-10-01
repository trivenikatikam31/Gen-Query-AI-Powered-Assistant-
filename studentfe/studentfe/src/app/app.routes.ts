import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  
  {
    path: 'upload-documents',
    loadComponent: () => import('./pages/upload-documents/upload-documents.page').then( m => m.UploadDocumentsPage)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
  
];
