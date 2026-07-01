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
            },
            {
                path:'forgotpassword',
                loadComponent:()=>import('./pages/forgotpassword/forgotpassword.component').then(m=>m.ForgotpasswordComponent)
            },
            {
                path:'resetpassword',
                loadComponent:()=>import('./pages/resetpassword/resetpassword.component').then(m=>m.ResetpasswordComponent)
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
                
                loadComponent:()=>import('./pages/userregistration/userregistration.component').then(m=>m.UserregistrationComponent)
            },
            {
                path:'department',
                canActivate:[authGuard,roleGuard],
                
                loadComponent:()=>import('./pages/department/department.component').then(m=>m.DepartmentComponent)
            },
            {
                path:'leavetype',
                canActivate:[authGuard,roleGuard],
                
                loadComponent:()=>import('./pages/leave-type/leave-type.component').then(m=>m.LeaveTypeComponent)
            },
            {
                path:'leave-assignment',
                canActivate:[authGuard,roleGuard],
                
                loadComponent:()=>import('./pages/leaveassignment/leaveassignment.component').then(m=>m.LeaveassignmentComponent)
            },
            {
                path:'unauthorized',
                component:UnauthorizedComponent
            },
            {
                path:'menumaster',
                canActivate:[authGuard,roleGuard],
                loadComponent:()=>import('./pages/menu-master/menu-master.component').then(m=>m.MenuMasterComponent)
            },
            {
                path:'leaverequest',
                canActivate:[authGuard,roleGuard],
                loadComponent:()=>import('./pages/leave-request/leave-request.component').then(m=>m.LeaveRequestComponent)
            },
            {
                path:'rolemaster',
                canActivate:[authGuard,roleGuard],
                loadComponent:()=>import('./pages/rolemaster/rolemaster.component').then(m=>m.RolemasterComponent)
            },
            {
                path:'leaveapproval',
                canActivate:[authGuard,roleGuard],
                loadComponent:()=>import('./pages/leaveapproval/leaveapproval.component').then(m=>m.LeaveapprovalComponent)
            }
        ]
    }
]