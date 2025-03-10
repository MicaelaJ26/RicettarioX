import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';   
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/core/interceptors/jwt-interceptor.service';
import { ErrorInterceptor } from './app/core/interceptors/error-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  
    provideHttpClient(withInterceptors([JwtInterceptor, ErrorInterceptor])) 
  ]
}).catch(err => console.error(err));
