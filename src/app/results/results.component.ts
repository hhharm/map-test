import {Component, OnInit} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {LogMessage} from '../app.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  _hideDetails = true;
  _showHint = true;
  mergeMessages: LogMessage[] = [];
  switchMessages: LogMessage[] = [];
  mapMessages: LogMessage[] = [];
  kitchenId = 0;
  outerDelay = 10;
  innerDelay = 5;

  ngOnInit() {
    this.test(this.outerDelay, this.innerDelay);
  }


  rerun() {
    this._showHint = false;
    this.mergeMessages = [];
    this.switchMessages = [];
    this.mapMessages = [];
    this.test(this.outerDelay, this.innerDelay);
  }

  test(delay: number, delayInner: number) {
    this.getPeople(this.mergeMessages, delay).pipe(mergeMap((name: string) => {
      return this.handleOrder(name, this.mergeMessages, delayInner);
    })).subscribe(message => this.mergeMessages.push({id: message, type: 'OUT'}), () => {
    }, () => {
      this.getPeople(this.switchMessages, delay).pipe(switchMap((name: string) => {
        return this.handleOrder(name, this.switchMessages, delayInner);
      })).subscribe(message => this.switchMessages.push({id: message, type: 'OUT'}), () => {
      }, () => {
        this.getPeople(this.mapMessages, delay).pipe(map((name: string) => {
          return '[Out] (from ' + name + ') ' + name + '\'s address ';
        })).subscribe(message => this.mapMessages.push({id: message, type: 'OUT'}));
      });
    });
  }

  trackByFn(value: LogMessage) {
    return value.id;
  }

  private handleOrder(name: string, logArray: LogMessage[], delay: number): Observable<string> {
    return new Observable<string>((observer: Subscriber<string>) => {
      const orders: string[] = ['address1', 'address2', 'address3'];
      this.kitchenId++;
      logArray.push({id: '[Value generator (' + this.kitchenId + ' active)] Began producing values for ' + name, type: 'KITCHEN'});
      const id = setInterval(() => {
        const value = '[Out] (from ' + name + ') ' + orders.shift();
        logArray.push({
          id: '[Value generator (' + this.kitchenId + ' active)] Next value is sent for ' + name,
          type: 'KITCHEN'
        });
        observer.next(value);
        if (!orders.length) {
          logArray.push({
            id: '[Value generator (' + this.kitchenId + ' active)] All is done for ' + name + '!',
            type: 'KITCHEN'
          });
          observer.complete();
        }
      }, delay);

      const self = this;
      // return unsubscribe logic
      return {
        unsubscribe() {
          self.kitchenId--;
          logArray.push({
            id: '[Value generator (' + self.kitchenId + ' active)] Stopped producing values for ' + name,
            type: 'KITCHEN'
          });
          clearInterval(id);
        }
      };
    });
  }

  private getPeople(logArray: LogMessage[], delay: number): Observable<string> {
    return new Observable<string>((observer) => {
      const names = ['John', 'Sara', 'Adam'];
      const id = setInterval(() => {
        if (!names.length) {
          clearInterval(id);
          observer.complete();
          return;
        }
        logArray.push({id: '[In] ' + names[0], type: 'IN'});
        observer.next(names.shift());
      }, delay);
    });
  }
}
