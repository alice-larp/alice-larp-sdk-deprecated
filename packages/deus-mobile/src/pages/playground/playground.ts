import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TimeService } from '../../time/time.service';

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  currentTime: string;
  lastQR: string = '(none)';
  constructor(public navCtrl: NavController,
    private _timeService: TimeService,
    private _barcodeScanner: BarcodeScanner) {

    Observable.timer(0, 10000).forEach(() => this.enqueTimeUpdate());
  }

  enqueTimeUpdate(): void {
    console.log('enqueTimeUpdate');
    this._timeService.getTime().subscribe(
      json => this.currentTime = `${json.hours}:${json.minutes}:${json.seconds}`,
      error => console.error('Error: ' + JSON.stringify((error)))
    );
  }

  scanQRCode(): void {
    this._barcodeScanner.scan().then((barcodeData) => {
      console.log('Read QR code: ', barcodeData);
      if (barcodeData['cancelled'])
        this.lastQR = '(cancelled)';
      else
        this.lastQR = barcodeData['text'];
    }, (err) => {
      console.log('Error reading QR code: ', err);
    });
  }

}
