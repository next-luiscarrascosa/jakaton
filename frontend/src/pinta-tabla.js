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



// Define the element's API using an ES2015 class
//<pinta-tabla url="localhost:3000/mtap" titulo="aplicaciones" literales='["Codigo Aplicacion","Descripcion Aplicación"]'></pinta-tabla>
class pintaTabla extends PolymerElement {
  static get template() {
    return html `
      <style>
      :host {
        display: block;
      height: 100%;
        width: 100%;
      }
      #pages {
        display: flex;
        flex-wrap: wrap;
        margin: 20px;
      }
      #pages > button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
      }
      #pages > button:not([disabled]):hover,
      #pages > button:focus {
        color: #ccc;
        background-color: #eee;
      }
      #pages > button[selected] {
        font-weight: bold;
        color: white;
        background-color: #ccc;
      }
      #pages > button[disabled] {
        opacity: 0.5;
        cursor: default;
      }
    </style>
    <iron-ajax auto id="AjaxTabla" name="AjaxTabla" url={{url}} handle-as="text" on-response="trata">
    </iron-ajax>
    <h2>[[titulo]]</h2>
  <vaadin-grid 
    id='tabla' 
    name="tabla" 
    columnReorderingAllowed=true 
    height-by-rows 
    theme="row-stripes wrap-cell-content"
    items="[[filas]]" as="fila" 
    index-as="indice">
  <template  is=dom-repeat items="[[columnas]]" as=column >
      <vaadin-grid-filter-column resizable header=[[column]] path=[[column]]>
        <template class="header">[[column]]</template>
        <template>[[get(column, item) ]] </template>
      </vaadin-grid-column>
  </template>
  </vaadin-grid>
  <div id="pages" name="pages" ></div>
      `;
  }
  
  trata(e) {
    console.log("Entramos a trata");
    this.worka = JSON.parse(e.detail.response);
    console.log("pagina:" + this.paginado);
    this.$.tabla.pageSize = this.paginado;
    if(this.paginado > this.worka.length) {
      console.log("desactivando paginado");
      
      this.$.pages.style.display = 'none';
      this.paginar = false;
    }
    //this.$.detallesTAAP.items = worka;
    //console.log(this.literales);
    // var colsNombre = Object.keys(this.worka[0]);
    // var colsLiteral = this.literales;
    // for (var n = 0; n < colsNombre.length; n++) {
    //   this.columnas.push({
    //     "literal": colsLiteral[n],
    //     "valor": colsNombre[n]
    //   });
    // }
    this.columnas= Object.keys(this.worka[0]);
    this.updateItemsFromPage(1);
    var x = this.$.tabla.getElementsByTagName('vaadin-grid-filter-column');
    for(var n=0 ; n<x.length ; n++ ){
      x[n].header = this.literales[n] +"(" +  x[n].header + ")";
    }
  }


  updateItemsFromPage(page) {
    var grid = this.$.tabla;
    var pagesControl = this.$.pages;
    var objeto = this;
    console.log("grid:" + grid + " pagesControl:" + pagesControl);
    console.log("pages:" + this.pages);
    if (page === undefined) {
      return;
    }
    if (this.pages == -1) {
      this.pages = Array.apply(null, {
        length: Math.ceil(this.worka.length / grid.pageSize)
      }).map(function (item, index) {
        return index + 1;
      });
      const prevBtn = window.document.createElement('button');
      prevBtn.textContent = '<';
      prevBtn.addEventListener('click', function () {
        const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
        objeto.updateItemsFromPage(selectedPage - 1);
      });
      pagesControl.appendChild(prevBtn);
      this.pages.forEach(function (pageNumber) {
        const pageBtn = window.document.createElement('button');
        pageBtn.textContent = pageNumber;
        pageBtn.addEventListener('click', function (e) {
          objeto.updateItemsFromPage(parseInt(e.target.textContent));
        });
        if (pageNumber === page) {
          pageBtn.setAttribute('selected', true);
        }
        pagesControl.appendChild(pageBtn);
      });
      const nextBtn = window.document.createElement('button');
      nextBtn.textContent = '>';
      nextBtn.addEventListener('click', function () {
        const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
        objeto.updateItemsFromPage(selectedPage + 1);
      });
      pagesControl.appendChild(nextBtn);
    }
    const buttons = Array.from(pagesControl.children);
    buttons.forEach(function (btn, index) {
      if (parseInt(btn.textContent) === page) {
        btn.setAttribute('selected', true);
      } else {
        btn.removeAttribute('selected');
      }
      if (index === 0) {
        if (page === 1) {
          btn.setAttribute('disabled', '');
        } else {
          btn.removeAttribute('disabled');
        }
      }
      if (index === buttons.length - 1) {
        if (page === objeto.pages.length) {
          btn.setAttribute('disabled', '');
        } else {
          btn.removeAttribute('disabled');
        }
      }
    });
    var start = (page - 1) * grid.pageSize;
    var end = page * grid.pageSize;
    this.filas = this.worka.slice(start, end);
  }

  static get properties() {
    return {
      titulo: {
        type: String,
        value: ''
      },
      url: {
        type: String,
        value: "",
        notify: true,
        reflectToAttribute: true
      },
      columnas: {
        type: Object,
        value: [],
        notify: true,
        reflectToAttribute: true
      },
      literales: {
        type: Object,
        value: [],
        notify: true,
        reflectToAttribute: true
      },
      filas: {
        type: Object,
        value: [],
        notify: true,
        reflectToAttribute: true
      },
      paginado: {
        type: Number,
        value: 50
      },
      pages: {
        type: Number,
        value: -1
      },
      worka: {
        type: Object,
        value: [],
        notify: true
      }
    }
  }
  static get is() {
    return 'pinta-tabla';
  }

  constructor() {
    super();


  }

};


// Register the x-custom element with the browser
customElements.define('pinta-tabla', pintaTabla);