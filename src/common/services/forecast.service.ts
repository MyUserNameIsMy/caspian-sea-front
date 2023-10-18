import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/api.url';
import { ISeaLevel } from '../interfaces/sea-level.interface';
import { PhotoTypeEnum } from '../enums/photo-type.enum';

@Injectable({ providedIn: 'root' })
export class ForecastService {
  constructor(private readonly http: HttpClient) {}
  getForecast(queryParams: any) {
    console.log(queryParams);
    return this.http.get<ISeaLevel[]>(`${BASE_URL}`, { params: queryParams });
  }

  getPhoto(photo_type: PhotoTypeEnum | string, date: Date) {
    return this.http.get<{ url: string }>(`${BASE_URL}uploads/photos`, {
      params: {
        photo_type,
        date: date.toLocaleString(undefined, { hour12: false }),
      },
    });
  }

  getAnalyzedDates() {
    return this.http.get<string[]>(`${BASE_URL}analyzed-dates`);
  }
}
