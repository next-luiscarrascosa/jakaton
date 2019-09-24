import {
  html,
  PolymerElement
} from '@polymer/polymer/polymer-element.js';
import '/src/consola-aso3-agrupaciones.js';
import '/src/consola-aso3-smc.js';
//import '/src/consolaASO3-app/pinta-tree.js';
import '/src/pinta-tabla.js';


import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-route/app-location.js';
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js';

{/* <div style="width:400px">
        <pinta-tree url="http://localhost:3000/arbolAgrupas" titulo="Arbol Agrupaciones" paginado=200></pinta-tree>
      </div> */}
{/* <consola-aso3-smc></consola-aso3-smc> */}

/**
 * @customElement
 * @polymer
 */
class ConsolaASO3App extends PolymerElement {
  static get template() {
    return html `
      <style>
        :host {
          display: block;         
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
      </style>
    <h2 style=" text-align: center;">Cuadro de Mandos Consola Seguridad ASO for DUMMIES</h2>
    <vaadin-split-layout >
    
      <pinta-tree style="width: 25%;" url="http://localhost:3000/arbolAgrupas" titulo="Tabla AAP" paginado=200></pinta-tree>
      <vaadin-split-layout orientation="vertical" style="width: 75%;">
    <div class="col-10" >
    <consola-aso3-smc></consola-aso3-smc> 
              </vaadin-split-layout>
    </vaadin-split-layout>      
        
    `;
  }
  properties() {
    return {
      prop1: {
        type: String,
        value: 'consola-aso3-app'
      }
    }
  }
}

window.customElements.define('consola-aso3-app', ConsolaASO3App);