import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, Subject, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

const WEB_API = 'https://random-word-api.herokuapp.com'

@Injectable({
  providedIn: 'root'
})
export class WordGeneratorService {

  selectedWord: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient) {}

  getNewWord(): void {
    this.http.get<string[]>(`${WEB_API}/all`)
      .subscribe(response => {
        const maxValue = response.length;
        const randomValue = this.getRandomInt(maxValue - 1);

        this.selectedWord.next(response[randomValue]);
      });
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
