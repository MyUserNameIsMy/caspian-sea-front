import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/api.url';
import { IObservationPost } from '../interfaces/observation-post.interface';

@Injectable({
  providedIn: 'root',
})
export class ObservationPostService {
  constructor(private readonly http: HttpClient) {}

  getObservationPosts() {
    return this.http.get<IObservationPost[]>(`${BASE_URL}observation-post`);
  }
}
