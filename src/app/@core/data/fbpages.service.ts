import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class FbPagesService {

  private fbPagesArray: Observable<any[]>;

  constructor() {
    
  }

  add(fbPages) {
    this.fbPagesArray = fbPages;
  }

  getArray(): Observable<any[]> {
    return this.fbPagesArray;
  }
}
