import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Item } from '../../interfaces/Item.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [],
})
export class FotosComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  cargando: boolean;

  // items es un obsevable por eso se puede usar el pipe sync para obtener la respuesta

  constructor(private firebase: AngularFirestore) {
    this.cargando = true;

    // 'img' es el nodo en firestore
    this.itemsCollection = firebase.collection<Item>('img');
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe(() => (this.cargando = false));
  }

  ngOnInit(): void {}
}
