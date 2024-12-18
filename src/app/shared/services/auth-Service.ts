import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config-service';

interface LoginDTO {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private config: any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService // Inject ConfigService
  ) {
    this.configService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  // Login method to communicate with the backend API
  login(loginData: LoginDTO): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/login`, loginData);
  }
}
