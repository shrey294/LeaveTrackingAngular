import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideToastr} from 'ngx-toastr';
import { tokenInterceptor } from './app/core/interceptors/token.interceptor';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
bootstrapApplication(AppComponent,{
  providers:[
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut:2000,
      positionClass:'toast-top-right',
      preventDuplicates:true,
      closeButton:true
    })
  ]
});
