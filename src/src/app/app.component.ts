import {Component, OnInit} from '@angular/core';
import {Observable, Subscriber} from "rxjs";
import {map, mergeMap, switchMap} from "rxjs/operators";


export interface LogMessage {
    id: string;
    type: "IN" | "OUT" | "KITCHEN";
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        this.test(100, 50);
    }
    mergeShowIO: boolean = true;
    showCode: boolean;

    readonly mergeMessages: LogMessage[] = [];
    readonly switchMessages: LogMessage[] = [];
    readonly mapMessages: LogMessage[] = [];
    kitchenId: number = 0;

    private handleOrder(name: string, logArray: LogMessage[], delay: number): Observable<string> {
        return new Observable<string>((observer: Subscriber<string>) => {
            const orders: string[] = ["address1", "address2", "address3"];
            this.kitchenId++;
            logArray.push({id: "[Value generator (" + this.kitchenId + " active)] Began cooking for " + name, type: "KITCHEN"});
            const id = setInterval(() => {
                const value = "[Out] Sent for " + name + " to " + orders.shift();
                logArray.push({
                    id: "[Value generator (" + this.kitchenId + " active)] Next is ready for " + name,
                    type: "KITCHEN"
                });
                observer.next(value);
                if (!orders.length) {
                    logArray.push({
                        id: "[Value generator (" + this.kitchenId + " active)] All is done for " + name + "!",
                        type: "KITCHEN"
                    });
                    observer.complete();
                }
            }, delay);

            let self = this;
            //return unsubscribe logic
            return {
                unsubscribe() {
                    self.kitchenId--;
                    logArray.push({
                        id: "[Value generator (" + self.kitchenId + " active)] Stopped cooking for " + name,
                        type: "KITCHEN"
                    });
                    clearInterval(id);
                }
            };
        });
    }

    private getPeople(logArray: LogMessage[], delay: number): Observable<string> {
        return new Observable<string>((observer) => {
            const names = ["John", "Sara", "Adam"];
            const id = setInterval(() => {
                if (!names.length) {
                    clearInterval(id);
                    observer.complete();
                    return;
                }
                logArray.push({id: "[In] Next person: " + names[0], type: "IN"});
                observer.next(names.shift());
            }, delay);
        });
    }

    test(delay: number, delayInner: number) {
        this.getPeople(this.mergeMessages, delay).pipe(mergeMap((name: string) => {
            return this.handleOrder(name, this.mergeMessages,delayInner);
        })).subscribe(message => this.mergeMessages.push({id: message, type: "OUT"}), () => {
        }, () => {
            this.getPeople(this.switchMessages, delay).pipe(switchMap((name: string) => {
                return this.handleOrder(name, this.switchMessages,delayInner);
            })).subscribe(message => this.switchMessages.push({id: message, type: "OUT"}), () => {
            }, () => {
                this.getPeople(this.mapMessages, delay).pipe(map((name: string) => {
                    return "[Out] Sent for " + name + " to " + name + "'s address";
                })).subscribe(message => this.mapMessages.push({id: message, type: "OUT"}));
            });
        });
    }

    trackByFn(value: LogMessage) {
        return value.id;
    }
}