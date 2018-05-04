import { Component } from '@angular/core';
import {AlertController, NavController, Platform, ToastController} from 'ionic-angular';
import {FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {EmailComposer} from "@ionic-native/email-composer";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {FileOpener} from "@ionic-native/file-opener";
import {FilePath} from "@ionic-native/file-path";
import {Base64} from "@ionic-native/base64";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  letterObj = {
    to: 'Paola Gama',
    from: 'Juan Bracamonte',
    text: 'hola :D'
  };

  pdfObj = null;
  rutaPdf:any;
  constructor(private emailComposer:EmailComposer,
              private file: File,
              private FilePath:FilePath,
              private alertController:AlertController,
              private fileOpener: FileOpener,
              private toastCtrl:ToastController,
              private b64:Base64,
              private plfrm:Platform) {
  }



  sendPDF(pdf:any) {

      let email = {
        to:'email@gmail.com',
        attachments:[
          pdf
        ],
        subject:'Prueba envio de correo',
        body:'prueba 1233',
        isHtml:true
      };
      this.emailComposer.open(email);

  }

  createPDF(){

    let docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Hola1',
            'Hola2',
            'Hola3',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };


    this.pdfObj = pdfMake.createPdf(docDefinition);
    if (this.plfrm.is('cordova')) {
      let self = this;

      this.pdfObj.getBuffer((buffer) => {
        let utf8 = new Uint8Array(buffer);
        let binaryArray = utf8.buffer;
        self.saveToDevice(binaryArray,"Ejemplo.pdf")
      });
    } else {
      let num = "102434";
      this.pdfObj.getDataUrl((url)=>{
        console.log("url: "+url);
      });
      this.pdfObj.download("pedido "+num);
    }

  }

  saveToDevice(data:any,savefile:any){
    let self = this;
    self.file.writeFile(self.file.externalDataDirectory, savefile, data, {replace:false});
    let ruta=self.file.externalDataDirectory+savefile;
    this.sendPDF(ruta);
  }


}
