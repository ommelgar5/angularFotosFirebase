import { Directive, EventEmitter, Output, ElementRef, HostListener, Input } from '@angular/core';
import { FileItem } from '../models/file-item';


/*
EventEmitter    Emitimir eventos al padre
Output          Enviar datos al padre
Estas dos van realacinadas

ElementRef      Referencia inmediata del elemento donde se aplica la direcctiva
HostListener    Decorador que permite escuchar los eventos del elemento donde se aplicó la directiva
                No es necesario injectarlo solo

                sintaxis
                @HostListener('event',['argumentos']) NombreFuncion(event:any) { }

                argumentos -> Array de argumentos de tipo string que son pasados a la funcion

                $event -> Es el objeto del evento disparado
                Ejemplo de uso:
                $event     Evento completo
                $event.target -> El elemeto que disparo el evento

NOTA:
Drag : Arrastrar
Drop: Soltar

*/

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mauseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }



  @HostListener('dragover', ['$event']) onDragEnter(event: DragEvent) {
    this.mauseSobre.emit(true);
    this._prevenirAccionesPorDefecto(event);
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    this.mauseSobre.emit(false);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent){

    // Obener los archivos del tipo DataTransfer,
    // La lista de archivos se encuentran el la propidad files de tipo FileList, que contiene objetos de tipo File
    const transferencia = this._getTranferencia(event);

    if( !transferencia) return;

    this._extraerArchivos(transferencia.files);

    this._prevenirAccionesPorDefecto(event);
    this.mauseSobre.emit(false);

  }

  /*
    Para extender la compatiblidad de los navegadores de como manejan la dataTransfer

    Algunos lo manejan como: event.dataTransfer y otros como event.originalEvent.dataTransfer
  */

  private _getTranferencia(event: any):DataTransfer {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }


  private _extraerArchivos( archivosLista: FileList ){

    // Obtenemos un array depropiedades [0,1,2,3] que hacer refrencia a cada objeto
    for( const propiedad in Object.getOwnPropertyNames( archivosLista )){

      // arhivosLista[0] y extrae el objeto de tipo archivo File
      const archivoTemporal = archivosLista[propiedad];

      if(this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }

    console.log(this.archivos);

  }




  // Validaciones

  private _archivoPuedeSerCargado( archivo: File ):boolean {
    if( !this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)){
      return true;
    }

    return false;
  }


  private _prevenirAccionesPorDefecto( event ){
      event.preventDefault();
      event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo: string ): boolean {

    for( const archivo of this.archivos ){
      if( archivo.nombreArchivo == nombreArchivo) {
        console.log(`El archivo ${ nombreArchivo } ya fue agregado`);
        return true;
      }
    }

    return false;
  }

  private _esImagen(tipoArchivo: string ): boolean {

    return ( tipoArchivo == '' || tipoArchivo == undefined) ? false : tipoArchivo.startsWith('image');

    /*
    Comineza con
    startsWith('') -> retorna 1 si se cumple la condicion y -1 si no se encuertra el cual se interpretan como true o false
    */

  }




}
