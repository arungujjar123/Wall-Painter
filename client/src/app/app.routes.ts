import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VisualizerComponent } from './features/visualizer/visualizer.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ColorManagementComponent } from './features/admin/color-management/color-management.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Smart Wall Paint Visualizer' },
  { path: 'login', component: LoginComponent, title: 'Login | Smart Wall Paint' },
  { path: 'register', component: RegisterComponent, title: 'Register | Smart Wall Paint' },
  { path: 'visualizer', component: VisualizerComponent, title: 'Visualizer Studio | Smart Wall Paint' },
  { path: 'gallery', component: GalleryComponent, title: 'Inspiration Gallery | Smart Wall Paint' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], title: 'My Projects | Smart Wall Paint' },
  
  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard], title: 'Admin Overview | Smart Wall Paint' },
  { path: 'admin/colors', component: ColorManagementComponent, canActivate: [adminGuard], title: 'Manage Colors | Admin' },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [adminGuard], title: 'Manage Users | Admin' },

  { path: '**', redirectTo: '' }
];
