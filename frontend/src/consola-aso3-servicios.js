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



// Define the element's API using an ES2015 class
//<pinta-tabla url="localhost:3000/mtap" titulo="aplicaciones" literales='["Codigo Aplicacion","Descripcion Aplicación"]'></pinta-tabla>
class consolaAso3Servicios extends PolymerElement {
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
      <iron-ajax id="ajaxDetalles" name="ajaxDetalles" url={{urlDetalles}} handle-as="text" on-response="trataDetalles">
      </iron-ajax>
      <h2>[[titulo]]</h2>
      <vaadin-combo-box label="SMC" name="comboSMC" id="comboSMC" on-selected-item-changed="cambioSMC"></vaadin-combo-box>
      <vaadin-combo-box label="OPE" name="comboOPE" id="comboOPE"></vaadin-combo-box>
      <vaadin-grid 
        id='tabla' 
        name="tabla" 
        columnReorderingAllowed=true 
        height-by-rows 
        theme="row-stripes wrap-cell-content"
      >
     

      <vaadin-grid-filter-column  path="cod_sop"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="politica"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="des_nompolit"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="des_pol"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="cod_ncol"></vaadin-grid-filter-column>
      <vaadin-grid-column id="detallesAAP"></vaadin-grid-column>
    </vaadin-grid>
    <div id="pages" name="pages" ></div>
      `;
  }
  //"cod_sop":"1-NONE","politica":"3","des_nompolit":"CLI-BBVA","des_pol":"CLI-BBVA","cod_ncol":"CLI-clientes"
  cambioSMC(e) {
    console.log("Entramos al evento cambioSMC"+e.detail.value);
    var comboOPE = this.$.comboOPE;
    var indice = this.conComboSMC.findIndex(x => x.nombre === e.detail.value);
    var valores = new Set(this.conComboSMC[indice].opes);
    comboOPE.items = Array.from(valores);
  }
  trataDetalles(e) {
   console.log("Entramos a tratDetalles con registros:"+e.detail.response);
   var objeto = this;
   var grid = objeto.$.tabla;
   objeto.datosDetalle = JSON.parse(e.detail.response);
   //console.log(aapsW);
   grid.openItemDetails(objeto.itemDetail);
  }
  trata(e) {
    console.log("Entramos a trata");
    
    var objeto = this;
    objeto.worka = JSON.parse(e.detail.response);
    var grid = objeto.$.tabla;
    var comboSMC = objeto.$.comboSMC;
    var detalles = objeto.$.detallesAAP;
    var ajaxDetalles = objeto.$.ajaxDetalles;
    //
    // DEFINO EL PAGINADO
    //
    //console.log("pagina:" + objeto.paginado);
    grid.pageSize = objeto.paginado;

    if(objeto.paginado > objeto.worka.length) {
      //console.log("desactivando paginado");      
      objeto.$.pages.style.display = 'none';
      objeto.paginar = false;
    }

    for(var x=0;x<objeto.worka.length;x++)  {
      //1351-SMC201500717OP002
      var partes = objeto.worka[x].cod_sop.split("-");
    
      if(partes[1].length > 16) {

        var smc = {};
        var opes = [];

        var indice = objeto.conComboSMC.findIndex(x => x.nombre === partes[1].slice(0,12));

        if(indice == -1) {
          smc.nombre = partes[1].slice(0,12);
          opes.push(partes[1].slice(12,17));
          smc.opes= opes;
          objeto.conComboSMC.push(smc);
        } else {
          objeto.conComboSMC[indice].opes.push(partes[1].slice(12,17));
        }

      }
    }
    //
    // DEFINO EL DATA PROVIDER DEL COMBOSMC
    //    
    comboSMC.dataProvider = function(params, callback) {

      var soloSMC = [];
      
      for(var x=0;x<objeto.conComboSMC.length;x++)  {
        
          soloSMC.push(objeto.conComboSMC[x].nombre);
      };

      
      callback(soloSMC, soloSMC.length);
      
      comboSMC.filteredItems = soloSMC;
     
    }
    //
    // DEFINO EL FILTRADO DEL COMBOSMC
    //
    comboSMC.addEventListener('filter-changed', function(e) {
      comboSMC.filteredItems = soloSMC.filter(function(item) {
        return item.indexOf(e.detail.value) === 0;
      });
    });
    //
    // DEFINO EL FILTRADO DEL GRID
    //
    grid.addEventListener('filter-changed', function(e) {
      //console.log("Elementos filtrados:"+grid.filteredItems);
    });
    //
    // DEFINO EL DATAPROVIDER DEL GRID
    //
    var wItems=[];
    grid.dataProvider = function(params, callback) {      
      //params.filters` format: [{path: 'lastName', direction: 'asc'}, ...];
        wItems = objeto.worka;
        params.filters.forEach(function(filter) {
        //console.log(filter);
        wItems=[];
        for(var x=0;x<objeto.worka.length;x++){
          if(objeto.worka[x][filter.path].includes(filter.value)){
            wItems.push(objeto.worka[x]);
          };
        };
      });
      
      grid.size =grid.pageSize;
      objeto.elemFiltrados = wItems;
      
      //console.log("elementos filtrados:"+objeto.elemFiltrados);
      
      callback(objeto.elemFiltrados);
     
    };
  //
  // defino la linea de detalle
  //

    grid.rowDetailsRenderer = function(root, grid, rowData) {
       if (!root.firstElementChild) {
         root.innerHTML =
         '<div class="details">' +
         '<table>' +
         '</table>' +
         '</div>';
       }
       console.log(rowData.item);
       var texto = "";
       for(var x=0;x<objeto.datosDetalle.length;x++){
          texto = texto  + "<tr><td>"+objeto.datosDetalle[x]+"</td></tr>";
       }
       //root.firstElementChild.querySelector('table').textContent = texto;
       root.firstElementChild.querySelector('table').innerHTML = texto;


    };

    const detailsToggleColumn = detalles;
    detailsToggleColumn.renderer = function(root, column, rowData) {
      if (!root.firstElementChild) {
        root.innerHTML = '<vaadin-checkbox>AAP de este colectivo</vaadin-checkbox>';
        root.firstElementChild.addEventListener('checked-changed', function(e) {
          if (e.detail.value) {
            
           // console.log("actualizo objeto.urlDetalles con el valor:"+rowData.item.cod_ncol)
           console.log("actualizo objeto.urlDetalles con el valor:"+objeto.$.tabla._rowWithFocusedElement._item.cod_ncol);
            
            var colec = objeto.$.tabla._rowWithFocusedElement._item.cod_ncol.split("-");
            objeto.itemDetail = objeto.$.tabla._rowWithFocusedElement._item;
            objeto.urlDetalles = "http://localhost:3000/buscaAAP?colectivo="+colec[0];
            ajaxDetalles.generateRequest();
            
           // grid.openItemDetails(root.item);
          } else {
            grid.closeItemDetails(root.item);
          }
        });
      }
      root.item = rowData.item;
      root.firstElementChild.checked = grid.detailsOpenedItems.indexOf(root.item) > -1;
    };
  




    //
    // Actualizo el paginado
    //
    this.updateItemsFromPage(1);
    




  }

  
  updateItemsFromPage(page) {
    var grid = this.$.tabla;
    var pagesControl = this.$.pages;
    var objeto = this;
    //console.log("grid:" + grid + " pagesControl:" + pagesControl);
    //console.log("pages:" + this.pages);
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
  computeUrlDetalles(urlDetalles){
    console.log(urlDetalles);
    if(urlDetalles.length>1) {
      return "http://localhost:3000/buscaAAP?colectivo="+urlDetalles;
    }
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
      urlDetalles: {
        type: String,
        value: "",
        notify: true
       
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
      },
      conComboSMC: {
        type: Object,
        value: []
      },
      elemFiltrados: {
        type: Object,
        value: [],
        notify: true
      } ,
      itemDetail: {
        type: Object,
        value: [],
        notify: true
      },
      datosDetalle: {
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
customElements.define('consola-aso3-servicios', consolaAso3Servicios);