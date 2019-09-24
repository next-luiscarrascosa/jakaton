
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import '/src/pinta-tabla.js';
import '/src/pinta-tree.js';
import '/src/consola-aso3-smc.js';
import '/src/consola-aso3-servicios.js';

// literales='["Codigo_Autorización","Servicio","Estado","Estado_Consumo",Version","Politica"]' 
// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="view1" href="[[rootPath]]view1">Autenticación</a>
            <a name="view2" href="[[rootPath]]view2">Agrupaciones</a>
            <a name="view3" href="[[rootPath]]view3">Consumo</a>
            <a name="view4" href="[[rootPath]]view4">Etiquetas</a>
            <a name="view5" href="[[rootPath]]view5">Validaciones</a>
            <a name="view6" href="[[rootPath]]view6">AAP</a>
            <a name="view7" href="[[rootPath]]view7">Parametros</a>
            <a name="view8" href="[[rootPath]]view8">Relación SMC-COLECTIVOS-AAP</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Consola de Seguridad ASO para Dummies</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <pinta-tabla name="view1" 
              url="http:\\\\localhost:3000\\tablas?tabla=mcau" 
              titulo="Controladores Autenticacion" 
              literales='["cod_cca", "cod_eac", "des_dca", "des_cpp", "des_cac", "qnu_ver", "xti_mgu"]' 
              paginado=200>
            </pinta-tabla>
            <pinta-tree name="view2" 
              url="http://localhost:3000/arbolAgrupas" 
              titulo="Tabla AAP" 
              paginado=200>
            </pinta-tree>
            <pinta-tabla name="view3"
              url="http:\\\\localhost:3000\\tablas?tabla=mase" 
              titulo="Autorización Consumo Servicios" 
              literales='["Codigo_Autorización","Servicio","Estado","Estado_Consumo","Version","Politica"]' 
              paginado=1000>
            </pinta-tabla>
            <pinta-tabla name="view4" url="http:\\\\localhost:3000\\tablas?tabla=meti" 
              titulo="Etiquetas" 
              literales='["cod_cet","cod_fml","cod_esf","cod_ncol","qnu_ret","qnu_rwi","qnu_mli","des_eti","qnu_ver"]' 
              paginado=200>
            </pinta-tabla>
            <div  name="view5">
              <pinta-tabla 
                url="http:\\\\localhost:3000\\tablas?tabla=mvap" 
                titulo="Validaciones AAP" 
                literales='["cod_aap", "cod_vlo", "des_pmt"]' 
                paginado=200>
              </pinta-tabla>
              <pinta-tabla 
                url="http:\\\\localhost:3000\\tablas?tabla=mava" 
                titulo="Validaciones activas" 
                literales='["Codigo Validacion","Parametros","Operacion","AAP"]' 
                paginado=200>
              </pinta-tabla>              
            </div>
            <pinta-tabla name="view6" 
              url="http:\\\\localhost:3000\\tablas?tabla=maap" 
              titulo="Aplicaciones" 
              literales='["Codigo AAP","Colectivo","Tipo AAP","xti_sperm","Aplicacion","TTL","qnu_vr","qnu_vm","xti_fpe","des_fiu","des_gut","qnu_ver","Estado","des_urlserv","Local/Global","cod_cos","xti_chgpw","xti_multifir"]' 
              paginado=200>
              </pinta-tabla>
            <consola-aso3-smc name="view7"></consola-aso3-smc>
            <div class="col-1" style="width:1450px;" name="view8">
              <consola-aso3-servicios 
                url="http:\\\\localhost:3000\\tablas?tabla=smc2aap" 
                titulo="Tipos aplicaciones" literales='["","","","",""]' paginado=200>
              </consola-aso3-servicios>
            </div>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'view1';
    } else if (['view1', 'view2', 'view3', 'view4', 'view5', 'view6','view7','view8'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'view1':
      //  import('./my-view1.js');
        break;
      case 'view2':
       // import('./my-view2.js');
        break;
      case 'view3':
       // import('./my-view3.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);
