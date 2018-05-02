import { Component } from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {FileUploadOptions, FileTransferObject, FileTransfer} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {EmailComposer} from "@ionic-native/email-composer";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {FileOpener} from "@ionic-native/file-opener";
import {FilePath} from "@ionic-native/file-path";
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
  fileTransfer:FileTransferObject = this.transfer.create();
  constructor(public navCtrl: NavController,
              private emailComposer:EmailComposer,
              private file: File,
              private transfer:FileTransfer,
              private FilePath:FilePath,
              private alertController:AlertController,
              private fileOpener: FileOpener,
              private plfrm:Platform) {
  }



  sendPDF(pdf:any) {


      let email = {
        to:'paolaggd@gmail.com',
        attachments:[
          pdf
        ],
        subject:'Prueba envio de correo',
        body:'Pdf de prueba',
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

      this.pdfObj.getBuffer((buffer) => {
        let blob = new Blob([buffer], { type: 'application/pdf' });
        debugger;

        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');

        })
      });
    } else {
      let num = "102434";
      this.pdfObj.download("pedido "+num);
    }

  }


}
