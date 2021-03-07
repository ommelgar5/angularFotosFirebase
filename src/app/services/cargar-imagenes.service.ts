import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CargarImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private firebase: AngularFirestore,
                private storage: AngularFireStorage ) { }

  guardarImagenesFirebase( imagenes: FileItem[]){


    for( const item of imagenes){

      /*
        this.storage.ref(pathDelArchivo)
      */
      const storageRef = this.storage.ref(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`);
      item.estaSubiendo = true;

      // if(item.progreso >= 100 ) continue;

      /*
          item.archivo
          Esta definido en el modelo personalizado, al enviar el archivo ya contiene: nombre, peso, tipo, etc

          Monitoreando la carga

          snapshotChanges(): Observable<FirebaseStorage.UploadTaskSnapshot>
            Emite el raw a UploadTaskSnapshot que avanza la carga del archivo.

          percentageChanges(): Observable<number>
            Emite el porcentaje de finalización de la carga (un número Entero)

          getDownloadURL(): Observable<any>
            Emite la URL de descarga cuando está disponible



      */
      const tareaCarga: AngularFireUploadTask  = storageRef.put(item.archivo);

      tareaCarga.percentageChanges().subscribe( progreso => item.progreso = progreso );

      tareaCarga.snapshotChanges()
                .pipe( finalize( () => storageRef.getDownloadURL().subscribe( url => {
                  console.log(`Imagen ${ item.nombreArchivo } cargada correctamente!`);
                  item.estaSubiendo = false;

                  item.url = url;

                  this.guardarImagen({nombre: item.nombreArchivo, url: item.url});
                }))).subscribe();

    }

  }

  private guardarImagen( imagen: { nombre: string, url: string }) {
    this.firebase.collection(`/${ this.CARPETA_IMAGENES }`)
            .add(imagen);
  }
}
