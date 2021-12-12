import { Component, OnInit, OnDestroy } from '@angular/core';
import {WordGeneratorService} from "./word-generator.service";
import {fromEvent, Subscription} from "rxjs";

const FILLER_VALUE: string = '_';
const MAXIMUM_NUMBER_OF_MISTAKES = 4;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  pressedKey: string = '';
  guessingWord: string = ''
  countMistakes: number = 0;
  actualStateOfGuessingWord: string[] = [];
  alreadyPressedKeys: Set<string> = new Set<string>();

  isGameStarted: boolean = false;

  private wordSubscription: Subscription = Subscription.EMPTY;
  private pressedKeySubscription: Subscription = Subscription.EMPTY;

  constructor(
    private wordGeneratorService: WordGeneratorService) {}

  ngOnInit(): void {
    this.pressedKeySubscription = fromEvent(document, 'keypress')
      .subscribe(this.handleKeyEvent.bind(this));

    this.wordSubscription = this.wordGeneratorService.selectedWord
      .subscribe(this.selectNewWord.bind(this))
  }

  ngOnDestroy() {
    if (this.pressedKeySubscription) { this.pressedKeySubscription.unsubscribe();}
    if (this.wordSubscription) { this.wordSubscription.unsubscribe();}
  }

  public toggleNewGame(): void {
    this.clearState();
    this.isGameStarted = true;

    this.wordGeneratorService.getNewWord();
  }

  private clearState(): void {
    this.isGameStarted = false;
    this.countMistakes = 0;
    this.pressedKey = '';
    this.guessingWord = '';
    this.actualStateOfGuessingWord = [];

    this.alreadyPressedKeys.clear();
  }

  private handleKeyEvent(event: any): void {
    if (!this.isGameStarted) { return; }

    this.pressedKey = event.key
    const indexes = AppComponent.getIndicesOf(
      this.pressedKey, this.guessingWord);

    if(indexes.length == 0) {
      this.handleError();

      return;
    }

    console.log(`Show ${this.pressedKey} in the following position(s) ${indexes}`);
    indexes.forEach((index) =>
      this.actualStateOfGuessingWord[index] = this.pressedKey)

    const numberOfHitValues: number = this.actualStateOfGuessingWord
      .reduce((n, currentValue) => currentValue !== FILLER_VALUE ? n + 1 : n, 0);

    console.log(`# of hit values: ${numberOfHitValues}`);
    if (this.guessingWord.length === numberOfHitValues) {
      console.log("WIN!!! Game is over");

      this.clearState();
    }
  }

  private handleError(): void {
    console.log("Handle mistake ....")
    this.alreadyPressedKeys.add(this.pressedKey);

    this.countMistakes += 1;

    if (this.countMistakes === MAXIMUM_NUMBER_OF_MISTAKES) {
      console.log(`The game is lost, the word was ${this.guessingWord}`);
      this.clearState();
    }
  }

  private selectNewWord(value: string): void {
    this.guessingWord = value.toUpperCase();
    this.actualStateOfGuessingWord = new Array(this.guessingWord.length).fill(FILLER_VALUE);

    console.log(`The word to find out: ${this.guessingWord}`)
  }


  private static getIndicesOf(searchStr: string, str: string): number[] {
    const searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }

    let startIndex = 0, index, indices = [];

    str = str.toUpperCase();
    searchStr = searchStr.toUpperCase();

    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }

    return indices;
  }
}
