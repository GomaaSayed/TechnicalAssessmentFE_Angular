import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './shared/Interceptors/HttpInterceptor'; // تأكد من المسار الصحيح للمكون
import { HeaderComponent } from './shared/Components/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent], // تأكد من أنك استوردت RouterOutlet
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TechnicalAssessmentFE_Angular';
}
