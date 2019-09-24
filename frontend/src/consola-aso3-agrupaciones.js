import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
// import '../../node_modules/google-chart-polymer-3/google-chart.js';
// import {initGCharts} from '../../node_modules/google-chart-polymer-3/google-chart.js';

// Define the element's API using an ES2015 class
class consolaAso3Agrupaciones extends PolymerElement {
  
  // Define optional shadow DOM template
  static get template() { 
    return html`
    <style>
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    google-chart {
    height: 800px;
    width: 1000px;
  }
  </style>
  <iron-ajax auto id="AjaxAgrupa" name="AjaxAgrupa" url={{urlAgrupa}} handle-as="text" on-response="trataAgrupa">
  </iron-ajax>
  <!-- <h2>Hello [[prop1]]!</h2> -->
  <!-- <google-chart style="width: 1200px; height: 1100px;" -->
<google-chart 
    type='wordtree' id='gAgrupa' name='gAgrupa'
    options = '{colors: ["red", "blue", "yellow"],
                backgroundColor: "#277ECE",
                maxFontSize: 12,
                chartArea:{left:0,top:0,width:"100%",height:"100%"},
                height: 1000,
                width: 1000,
                wordtree: {
                  type: "suffix",
                  format: "explicit"
                  }
                }'
                >

</google-chart>

        <!-- shadow DOM for your element -->

      <!-- <div>[[greeting]]</div> --> <!-- data bindings in shadow DOM -->
    `;
  }

  // Declare properties for the element's public API
  static get properties() {
    return {
      greeting: {
        type: String
      },
      objetoAgrupa: {
        type: Object,
        reflectToAttribute: true
      },
      prop1: {
        type: String,
        value: 'Cuadro de Mandos Consola Seguridad ASO'
      },
      url: {
        type: String,
        value: "http:\\\\localhost:3000\\"
      },
      urlAgrupa: {
        type: String,
        value: "http:\\\\localhost:3000\\agrupa"
      },
      datosMaag: {
        type: String
      }
    }
  }
  
  constructor() {
    super();
    this.greeting = 'Hello agrupaciones!';
    
  }

  // Add methods to the element's public API
  greetMe() {
    console.log(this.greeting);
  }
  static get is() {
    return 'consolaaso-agrupaciones';
  }
  ready() {

    this.objetoAgrupa = this;
    this.urlAgrupa = "http:\\\\localhost:3000\\agrupa";
    super.ready();
  }

  trataAgrupa(e) {
    console.log("Entramos a trataAgrupa");

    this.datosAgrupa = JSON.parse(e.detail.response);
    this.drawChartAgrupa();
   

    //console.log(this.datosAgrupa);
  }
  drawChartAgrupa() {
    //console.log("Entramos en drawChartAgrupa para pintar estos datos:" + JSON.stringify(this.datosAgrupa));
    console.log("Entramos en drawChartAgrupa");
    //console.log("Entramos en drawChartAgrupa con datosAgrupa:"+this.datosAgrupa);
    var datos = this.datosAgrupa;
    // var options = {
    //   colors: ['white', 'blue', 'yellow'],
    //   backgroundColor: '#277ECE',
    //     maxFontSize: 20,
    //   wordtree: {
    //     type: 'suffix',
    //     format: 'explicit'
    //   }
    // };
    

    //data = new google.visualization.DataTable();
    //var data = document.createElement('google-chart-loader').dataTable();
    initGCharts(()=>{
          console.log("dentro de initGCharts:"+datos);
          //console.log(this);

          var objeto = this;
          
          document.createElement('google-chart-loader').dataTable().then(function(data) {
            
            data.addColumn('number', 'id');
            data.addColumn('string', 'EtiquetaHijo');
            data.addColumn('number', 'padre');
            data.addColumn('number', 'size');
            data.addColumn({type:'string',role: 'style'});

            data.addRow([0, "agrupaciones", -1, 1,'blue']);
            var agrupaAAP = "";
            var ultimoId = 0;
            //for (var i = 0; i < this.datosAgrupa.length; i++) {
            for (var i = 0; i < datos.length; i++) {
              data.addRow([i + 1, datos[i].des_agrupaap, 0, 2,'blue']);
            };

            ultimoId = datos.length + 1;

            for (i = 0; i < datos.length; i++) {

              agrupaAAP = datos[i].aaps;

              for (var n = 0; n < agrupaAAP.length; n++) {

                data.addRow([ultimoId++, agrupaAAP[n], i + 1, 3,'blue']);

              };

            };
            //console.log(objeto.gAgrupa);
            objeto.$.gAgrupa.data = data;

          });
  });

    // var chart = new google.visualization.WordTree(document.querySelectorAll("consolaaso-agrupaciones")[0].shadowRoot
    //   .querySelectorAll("#wordtree_basic")[0]);

  }

}

// Register the x-custom element with the browser
customElements.define('consola-aso3-agrupaciones', consolaAso3Agrupaciones);
