import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = 'http://192.168.1.5:3000';

  constructor(private http: HttpClient) {}

  uploadCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/leads/upload`, formData);
  }

  getLeads(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(`${this.apiUrl}/leads`, { params });
  }

  downloadCSV() {
    return this.http.get(`${this.apiUrl}/leads/export`, {
        responseType: 'blob' // penting untuk file download
    });
}
}
