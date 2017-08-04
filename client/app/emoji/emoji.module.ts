import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MaterializeModule} from 'angular2-materialize';
import { EmojiPickerModule } from 'angular2-emoji-picker';
import {EmojiInputComponent} from "./emojiinput.component";
import {ContenteditableDirective} from "./contenteditable.directive";
import  {EmojiPipe} from "./emoji.pipe";
import  {EmojiService} from "./emoji.service";


@NgModule({
  imports: [
    BrowserModule,MaterializeModule, EmojiPickerModule.forRoot()
  ],
  declarations: [
    EmojiInputComponent,
    ContenteditableDirective,
    EmojiPipe
  ],
  providers:[EmojiService],
  exports: [ EmojiInputComponent, EmojiPipe]
})
export class EmojiModule { }