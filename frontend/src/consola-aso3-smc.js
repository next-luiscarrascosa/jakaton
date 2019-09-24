import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '/src/pinta-tabla.js';



//<pinta-tabla url="http:\\\\localhost:3000\\maap" titulo="Tabla AAP" paginado=200></pinta-tabla>
// Define the element's API using an ES

class consolaAso3SMC extends PolymerElement {
  static get template() {
    return html `
      <style>
      :host {
        display: block;
      height: 100%;
        width: 100%;
      }
      .col-1 {width: 8.33%;}
      .col-2 {width: 16.66%;}
      .col-3 {width: 25%;}
      .col-4 {width: 33.33%;}
      .col-5 {width: 41.66%;}
      .col-6 {width: 50%;}
      .col-7 {width: 58.33%;}
      .col-8 {width: 66.66%;}
      .col-9 {width: 75%;}
      .col-10 {width: 83.33%;}
      .col-11 {width: 91.66%;}
      .col-12 {width: 100%;}
      [class*="col-"] {
        float: left;
        padding: 1px;
        
      }
      </style>
      <div class="col-1" style="width:650px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=etiquetas" titulo="Etiquetas" literales='["",""]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:350px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=mtap" titulo="Tipos aplicaciones" literales='["Codigo Aplicacion","Descripcion"]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:350px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=mtsp" titulo="Tipos Servicios Publicos" literales='["Codigo Tipo","Descripcion"]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:350px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=meac" titulo="Tipos Estado Activación" literales='["Codigo Estado","Descripcion"]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:750px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=mval" titulo="Tipos Validación" literales='["Codigo Validación","Descripcion","",""]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:750px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=mefr" titulo="Estados de Fraude" literales='["","Descripcion","version"]' paginado=200></pinta-tabla></div>
      <div class="col-1" style="width:750px;"><pinta-tabla url="http:\\\\localhost:3000\\tablas?tabla=mfam" titulo="Clases de Etiquetas(cod_fml)" literales='["","",""]' paginado=200></pinta-tabla></div>


    
  
      `;
  }
  //qnu_ttl":"360","qnu_vr":"240","qnu_vm":"4320","xti_fpe":"N","des_fiu":"nominal","des_gut":"nominal","qnu_ver":"0","cod_eac":"A","des_urlserv":"","cod_aapg":"L","cod_cos":"NO","xti_chgpw":"N","xti_multifir":"N"},
  // Declare properties for the element's public API

  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'Cuadro de Mandos Consola Seguridad ASO for DUMMIES'
      }
    }
  }
  static get is() {
    return 'consola-aso3-smc';
  }

  constructor() {
    super();


  }


};


// Register the x-custom element with the browser
customElements.define('consola-aso3-smc', consolaAso3SMC);