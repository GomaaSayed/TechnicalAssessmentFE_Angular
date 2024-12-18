// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configUrl = 'assets/Configurations/config.json'; // Path to the config file

  constructor(private http: HttpClient) {}

  // Load the config from the JSON file
  getConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }
}
