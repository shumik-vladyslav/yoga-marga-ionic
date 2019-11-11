import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class ToastHelper {
    constructor(public toastController: ToastController) {
    }

    public async presentTopMess(message = 'Сохранено') {
        const toast = await this.toastController.create({
            message: message,
            position: 'top',
            duration: 1000
        });
        await toast.present();
        await this.delay(2000);
    }

    private delay(milliseconds: number): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), milliseconds);
        });
    }
}