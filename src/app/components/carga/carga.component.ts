import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargarImagenesService } from '../../services/cargar-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [
  ]
})
export class CargaComponent implements OnInit {

  archivos: FileItem[] = [];
  estaSobreElemento: boolean = false;

  constructor(public _cargarImagenes: CargarImagenesService ) { }

  ngOnInit(): void {
  }

  cargarImagenes() {
      this._cargarImagenes.guardarImagenesFirebase(this.archivos);
  }

  limpiarImagenes(){
    this.archivos = [];
  }

}
