import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path:'',
        component:AuthLayoutComponent,
        children:[
            {
                path:'',
                loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)
            },
            {
                path:'login',
                loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)
            },
            {
                path:'signup',
                loadComponent:()=>import('./pages/signup/signup.component').then(m=>m.SignupComponent)
            }
        ]
    },
    {
        path:'',
        component:MainLayoutComponent,
        children:[
            {
                path:'dashboard',
                canActivate:[authGuard],
                loadComponent:()=>import('./pages/dashboard/dashboard.component').then(m=>m.DashboardComponent)
            },
            {
                path:'userregistration',
                canActivate:[authGuard,roleGuard],
                data:{role:'Admin'},
                loadComponent:()=>import('./pages/userregistration/userregistration.component').then(m=>m.UserregistrationComponent)
            },
            {
                path:'department',
                canActivate:[authGuard,roleGuard],
                data: { role: 'Admin' },
                loadComponent:()=>import('./pages/department/department.component').then(m=>m.DepartmentComponent)
            },
            {
                path:'leavetype',
                canActivate:[authGuard,roleGuard],
                data:{role:'Admin'},
                loadComponent:()=>import('./pages/leave-type/leave-type.component').then(m=>m.LeaveTypeComponent)
            },
            {
                path:'unauthorized',
                component:UnauthorizedComponent
            }
            
        ]
    }
]