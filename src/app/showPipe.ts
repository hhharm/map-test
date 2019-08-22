import {Pipe, PipeTransform} from '@angular/core';
import {LogMessage} from './app.component';

@Pipe({ name: 'checkVisibility' })
export class ShowPipe implements PipeTransform {
    transform(message: LogMessage, onlyIO: boolean): boolean {
      return !onlyIO || message.type === 'IN' || message.type === 'OUT';
    }
}
