import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

let counter = 0;

@Injectable()
export class UserService {

  private users = {
    angel: {
      name: 'Angel Tsvetkov',
      picture: 'https://scontent.xx.fbcdn.net/v/t31.0-1/15025507_10211574874113760_837024796244596595_o.jpg?oh=e8c308f9ec0749eb7ec33a21f529bf1a&oe=5AA79C9E',
    },
  };

  private userArray: any[];

  constructor() {
    this.userArray = Object.values(this.users);
  }

  getUsers(): Observable<any> {
    return Observable.of(this.users);
  }

  getUserArray(): Observable<any[]> {
    return Observable.of(this.userArray);
  }

  getUser(): Observable<any> {
    counter = (counter + 1) % this.userArray.length;
    return Observable.of(this.userArray[counter]);
  }
}
