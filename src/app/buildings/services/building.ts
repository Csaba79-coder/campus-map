import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Building {
  id?: any;
  name: string;
  description: string;
  userId: number;
  isPublic: boolean;
  polygon: [number, number][];
}

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/buildings';

  getAll(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl);
  }

  getById(id: any): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/${id}`);
  }

  create(building: Building): Observable<Building> {
    return this.http.post<Building>(this.apiUrl, building);
  }

  update(id: any, building: Building): Observable<Building> {
    return this.http.put<Building>(`${this.apiUrl}/${id}`, building);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
