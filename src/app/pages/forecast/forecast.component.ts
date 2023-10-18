import { Component, OnInit } from '@angular/core';
import { ObservationPostService } from '../../../common/services/observation-post.service';
import { IObservationPost } from '../../../common/interfaces/observation-post.interface';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForecastService } from '../../../common/services/forecast.service';
import { PhotoTypeEnum } from '../../../common/enums/photo-type.enum';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent implements OnInit {
  constructor(
    private readonly observationPostService: ObservationPostService,
    private readonly forecastService: ForecastService,
    private readonly toastr: ToastrService
  ) {}
  characteristics = [
    { id: 1, name: 'Уровень моря' },
    { id: 2, name: 'Высота значительной волны' },
    { id: 3, name: 'Направление волны' },
    { id: 4, name: 'Период волны' },
  ];

  intervals = [
    { id: 1, value: '00:00' },
    { id: 2, value: '01:00' },
    { id: 3, value: '02:00' },
    { id: 4, value: '03:00' },
    { id: 5, value: '04:00' },
    { id: 6, value: '05:00' },
    { id: 7, value: '06:00' },
    { id: 8, value: '07:00' },
    { id: 9, value: '08:00' },
    { id: 10, value: '09:00' },
    { id: 11, value: '10:00' },
    { id: 12, value: '11:00' },
    { id: 13, value: '12:00' },
    { id: 14, value: '13:00' },
    { id: 15, value: '14:00' },
    { id: 16, value: '15:00' },
    { id: 17, value: '16:00' },
    { id: 18, value: '17:00' },
    { id: 19, value: '18:00' },
    { id: 20, value: '19:00' },
    { id: 21, value: '20:00' },
    { id: 22, value: '21:00' },
    { id: 23, value: '22:00' },
    { id: 24, value: '23:00' },
  ];

  observation_posts: IObservationPost[] = [];
  forecast_form!: FormGroup;

  data: any;
  options: any;
  photo_path: any;
  analyzed_dates: any;

  ngOnInit() {
    this.getObservationPosts();
    this.initForm();
    this.getAnalyzedDates();
  }

  plotGraph(min_value: number, max_value: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      datasets: [
        {
          type: 'line',
          label: 'Уровень Моря Актау',
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.2,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          min: min_value,
          max: max_value,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  getObservationPosts() {
    this.observationPostService.getObservationPosts().subscribe({
      next: value => {
        this.observation_posts = value;
      },
      error: err => {
        this.toastr.error(err.message);
      },
    });
  }

  getAnalyzedDates() {
    this.forecastService.getAnalyzedDates().subscribe({
      next: value => {
        this.analyzed_dates = value;
        this.toastr.info(this.analyzed_dates);
        console.log(this.analyzed_dates);
      },
      error: err => {
        console.log(err);
        this.toastr.error(err.message);
      },
    });
  }

  onSubmit() {
    if (!this.forecast_form.value.characteristic_id) {
      this.forecast_form.patchValue({
        characteristic_id: this.characteristics[0].id,
      });
    }
    if (!this.forecast_form.value.date) {
      this.forecast_form.patchValue({
        date: new Date(),
      });
    }
    if (!this.forecast_form.value.time) {
      this.forecast_form.patchValue({
        time: 0,
      });
    }
    if (!this.forecast_form.value.observation_post_id) {
      this.forecast_form.patchValue({
        observation_post_id: this.observation_posts[0].id,
      });
    }
    this.forecastService.getForecast(this.forecast_form.value).subscribe({
      next: res => {
        this.toastr.success('Получены данные.');
        const levels = res.map(item => item.level);
        const max_level = Math.max(...levels);
        const min_level = Math.min(...levels);
        this.plotGraph(max_level + 0.02, min_level - 0.02);
        this.data.labels = res.map(item =>
          new Date(item.date_and_time).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        );
        this.data.datasets[0].data = levels;
      },
      error: err => {
        this.toastr.error(err.error.message);
      },
    });
    let photo_type = PhotoTypeEnum.NO;
    switch (this.forecast_form.value.characteristic_id) {
      case 1:
        photo_type = PhotoTypeEnum.SEA_LEVEL;
        break;
      case 2:
        photo_type = PhotoTypeEnum.WAVE_HEIGHT;
        break;
      case 3:
        photo_type = PhotoTypeEnum.WAVE_DIRECTION;
        break;
    }
    const date = new Date(this.forecast_form.value.date);
    date.setHours(this.forecast_form.value.time.split(':')[0], 0, 0, 0);

    this.forecastService.getPhoto(photo_type, date).subscribe({
      next: value => {
        this.toastr.success('Получено фото');
        this.photo_path = value.url;
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error.message);
      },
    });
  }
  initForm() {
    this.forecast_form = new FormGroup({
      characteristic_id: new FormControl('', Validators.required),
      date: new FormControl(new Date()),
      time: new FormControl(0),
      observation_post_id: new FormControl(Validators.required),
    });
  }
}
