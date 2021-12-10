import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {WordGeneratorService} from "./word-generator.service";
import {fromEvent, Subscription} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @Input() guessingWord: string = '';
  pressedKey: string = '';
  private wordSubscription: Subscription = Subscription.EMPTY;
  private pressedKeySubscription: Subscription = Subscription.EMPTY;

  constructor(
    private wordGeneratorService: WordGeneratorService) {}

  ngOnInit(): void {
    this.pressedKeySubscription = fromEvent(document, 'keypress')
      .subscribe((event:any) => {
        this.pressedKey = event.key

        console.log(this.guessingWord.includes(this.pressedKey.toUpperCase()));
      });

    this.wordSubscription = this.wordGeneratorService.selectedWord
      .subscribe(value => this.guessingWord = value.toUpperCase())

  }

  ngOnDestroy() {
    if (this.pressedKeySubscription) {
      this.pressedKeySubscription.unsubscribe();
    }

    if (this.wordSubscription) {
      this.wordSubscription.unsubscribe();
    }
  }

  toggleNewGame() {
    this.pressedKey = '';
    this.guessingWord = '';

    this.wordGeneratorService.getNewWord();
  }
}
