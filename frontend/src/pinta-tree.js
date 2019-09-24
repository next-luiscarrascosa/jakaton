
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js';

import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';

// Define the element's API using an ES2015 class
//<pinta-tabla url="localhost:3000/mtap" titulo=""></pinta-tabla>
// leaf="[[!item.hijos]]"
class pintaTree extends PolymerElement {
  static get template() {
    return html `
      <style>
      :host {
        display: block;
      height: 100%;
        width: 100%;
      }
      </style>

      <iron-ajax auto id="AjaxTabla" name="AjaxTabla" url={{url}} handle-as="text" on-response="trata" on-error="errores">
      </iron-ajax>
    
      <h2>[[titulo]]</h2>
      <vaadin-grid id="arbol"  columnReorderingAllowed=true 
      height-by-rows 
      theme="row-stripes wrap-cell-content"
       name="arbol" aria-label="Lista de Agrupaciones" data-provider="[[_dataProvider]]">
      
      <vaadin-grid-column path="name">
         
          <template>
              <vaadin-grid-tree-toggle  expanded="{{expanded}}" leaf="[[!item.hasChildren]]" level="[[level]]">
                [[item.name]] 
              </vaadin-grid-tree-toggle>
            </template>
        </template>
      </vaadin-grid-column>
    </vaadin-grid>
      
      `;
    //   <vaadin-grid id="arbol" name="arbol" aria-label="Tree Data Grid Example" >
    //   <vaadin-grid-tree-column path="nombre" item-has-children-path="hijos"></vaadin-grid-tree-column>
    //   <vaadin-grid-column path="nombre" width="8em" flex-grow="0"></vaadin-grid-column>
    // </vaadin-grid>
  }

  ready() {
    super.ready();
    //this.demo = JSON.parse(this.demo);
    console.log('my-element is ready!');
    console.log("llamado a:" + this.url);
  }
  errores(e) {
    console.log(e.message);
  }
  trata(e) {

    console.log("Entramos a trata");

    var objeto = this;
    objeto.worka = JSON.parse(e.detail.response);

    console.log("pagina:" + objeto.paginado);
    objeto.$.arbol.pageSize = objeto.paginado;
    //this.$.detallesTAAP.items = worka;
    objeto.columnas = Object.keys(this.worka[0]);

    var grid = objeto.$.arbol;
    console.log(grid);

    grid.dataProvider = function (params, callback) {

      // If the data request concerns a tree sub-level, `params` has an additional
      // `parentItem` property that refers to the sub-level's parent item

      console.log("llamada al dataProvider " + params);

      const parentUuid = params.parentItem ? params.parentItem.uuid : null;
      // Slice out only the requested items
      //const startIndex = params.page * params.pageSize;
      //const pageItems = objeto.worka.slice(startIndex, startIndex + params.pageSize);
      // Inform grid of the requested tree level's full size
      //const treeLevelSize = pageItems.length;

      var items = [];

      var treeItems = 0;

      for (var n = 0; n < objeto.worka.length; n++) {
        if (parentUuid) {
          if (objeto.worka[n].parentUuid == parentUuid) {
            items.push(objeto.worka[n]);
          }
        } else {
          if (!objeto.worka[n].parentUuid) {
            items.push(objeto.worka[n]);
          };
        }
      }
      var itemsW = items;
      // params.filters.forEach(function (filter) {
      //   console.log(filter.path + "-" + filter.value);
      //   for (var n = 0; n < items.length; n++) {
      //     if (items[n][filter.path].includes(filter.value)) {
      //       itemsW.push(items[n]);
      //     }

      //   }

      // });
      treeItems = itemsW.length;
      console.log("generando vista con items:" + treeItems);
      callback(itemsW, treeItems);
      // callback(JSON.parse('[{"name":"jaume", "size":"10"},{"name":"nuria","size":"42"}]'), 1);
    };


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
      demo: {
        type: Object,
        value: '[{"hasChildren":true,"name":"borders","size":"5","uuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":true,"name":"tangible_horizontal_pixel","size":"","uuid":"f51e6a76-8cc5-4796-996f-c028b7b635ed","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"invoice_ergonomic_frozen_mouse.mp4","size":"92.954 MB","uuid":"ae9f8604-865c-4891-99b9-20095e7c1f6f","parentUuid":"f51e6a76-8cc5-4796-996f-c028b7b635ed"},{"hasChildren":true,"name":"solid_state","size":"","uuid":"96703e6c-0973-4f41-a1eb-a95731031eb6","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"papua_new_guinea_industrial_open_architecture.png","size":"61.214 MB","uuid":"9e8a2b22-fbbd-47ae-b622-9286f0798c84","parentUuid":"96703e6c-0973-4f41-a1eb-a95731031eb6"},{"hasChildren":true,"name":"green_chicken_deliverables","size":"","uuid":"0ce82ff2-c009-441e-bd52-3b75eee94b58","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"circuit.m2a","size":"82.893 MB","uuid":"bbe7c195-4e26-453a-9190-65a93d9472f2","parentUuid":"0ce82ff2-c009-441e-bd52-3b75eee94b58"},{"hasChildren":true,"name":"supervisor_bike_attitude","size":"","uuid":"06eaf989-1a55-4bf2-b8d4-ff6a5441ac2c","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"back_up_national.gif","size":"56.836 MB","uuid":"73abff8e-6f0d-408a-b0e6-f0965559d630","parentUuid":"06eaf989-1a55-4bf2-b8d4-ff6a5441ac2c"},{"hasChildren":true,"name":"portals_indigo_sao_tome_and_principe","size":"","uuid":"89871d6b-b7e0-4855-ba7f-53ae282cb829","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"maximize_ergonomic.jpe","size":"75.915 MB","uuid":"f0f0efa6-e7bc-4b90-a754-65d11cd8ca7a","parentUuid":"89871d6b-b7e0-4855-ba7f-53ae282cb829"},{"hasChildren":false,"name":"integrate_drive.png","size":"48.038 MB","uuid":"1fe590ee-6d15-43ab-9738-3b6e13a4cfed","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"incredible_dynamic.gif","size":"40.568 MB","uuid":"e062060c-269c-4164-b039-10fd445cf980","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"texas_payment_chair.mpeg","size":"61.236 MB","uuid":"18daeab3-0c8d-45ba-b27d-d7af588a6f08","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"pizza_cambridgeshire.mpg4","size":"42.004 MB","uuid":"126c082c-9921-4908-8d7b-fea4542b3eef","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":false,"name":"payment_support_savings_account.m2v","size":"62.796 MB","uuid":"51d4cf56-d958-4a33-a480-f36cb3261728","parentUuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"},{"hasChildren":true,"name":"bedfordshire","size":"","uuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":true,"name":"cambridgeshire_attitude_oriented","size":"","uuid":"4f665ea9-3f7e-44c9-8fff-8b37e6332cb6","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"designer_adp_driver.pdf","size":"23.163 MB","uuid":"f6f3ec27-9864-45a0-ad5a-014e2c352d58","parentUuid":"4f665ea9-3f7e-44c9-8fff-8b37e6332cb6"},{"hasChildren":true,"name":"jewelery","size":"","uuid":"7536dcba-9076-47e4-a97c-2448f1eb2ef9","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"associate.m3a","size":"1.22 MB","uuid":"d7cebd77-8ef3-414c-b4bc-044590e05f1f","parentUuid":"7536dcba-9076-47e4-a97c-2448f1eb2ef9"},{"hasChildren":true,"name":"developer_e_tailers","size":"","uuid":"feccd44f-ffcb-45e4-b776-c9fba0e5b307","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"regional_user_facing_online.png","size":"56.073 MB","uuid":"f405ae22-24a0-4f9b-bcb6-72736c20b702","parentUuid":"feccd44f-ffcb-45e4-b776-c9fba0e5b307"},{"hasChildren":true,"name":"withdrawal_french_guiana","size":"","uuid":"d4f83ab5-bc43-4ed8-88a5-75459fa3da49","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"refined_granite_bacon_ivory.pdf","size":"86.985 MB","uuid":"509fa516-5292-4863-9623-f020c975c94c","parentUuid":"d4f83ab5-bc43-4ed8-88a5-75459fa3da49"},{"hasChildren":true,"name":"turquoise","size":"","uuid":"c19a75f9-a3b4-4bea-9c2e-a8e1b88c2203","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"bandwidth_incremental_refined_steel_chair.shtml","size":"29.158 MB","uuid":"70211d06-3b1f-46f0-9e7e-ace3198e0ff1","parentUuid":"c19a75f9-a3b4-4bea-9c2e-a8e1b88c2203"},{"hasChildren":false,"name":"website_sudanese_pound_deposit.gif","size":"82.875 MB","uuid":"3b45e28c-c551-4dba-aa06-2a6953021a74","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"assistant.m2v","size":"49.909 MB","uuid":"243862f2-c62a-4ecd-a6d2-b0f10ef2c59a","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"investment_account.png","size":"37.46 MB","uuid":"b1261b7c-13ed-4205-a239-2550dbd9533a","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"concrete_vertical.mp4v","size":"18.106 MB","uuid":"8f00c1fa-cd5e-4585-b7b9-4922dd6b528d","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":false,"name":"clothing_payment_chips.wav","size":"34.26 MB","uuid":"a0c7fcba-f899-4f0b-90f8-389fdbc05850","parentUuid":"5c8e5add-996b-4589-a70f-ce2505090687"},{"hasChildren":true,"name":"flat_manager_panel","size":"","uuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":true,"name":"tasty_wooden_chair","size":"","uuid":"6cb1c786-dddb-4f54-8dba-6cd19df6ee71","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"brand.html","size":"50.462 MB","uuid":"9893842f-ebb7-45bd-91b1-980e7229c0b2","parentUuid":"6cb1c786-dddb-4f54-8dba-6cd19df6ee71"},{"hasChildren":true,"name":"handcrafted_fresh_salad_springs_unbranded","size":"","uuid":"886eb92b-6640-4452-a78a-40d3d4dbd5e6","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"monitor.mp2a","size":"43.94 MB","uuid":"aaee655d-2adb-40b8-be3a-0f300bbbd4e1","parentUuid":"886eb92b-6640-4452-a78a-40d3d4dbd5e6"},{"hasChildren":true,"name":"montana_data_warehouse","size":"","uuid":"9c023c4e-f79e-4560-baaf-60916195f98f","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"intuitive_avon_methodology.jpg","size":"54.685 MB","uuid":"c6d0f59c-41d6-4629-99a7-d3275eea41c9","parentUuid":"9c023c4e-f79e-4560-baaf-60916195f98f"},{"hasChildren":true,"name":"steel","size":"","uuid":"f2b6536d-e636-4a57-a011-feeeee84d4ba","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"personal_loan_account_engineer_credit_card_account.m3a","size":"83.146 MB","uuid":"8d917eb0-0dfe-41d9-a958-863ad12550ca","parentUuid":"f2b6536d-e636-4a57-a011-feeeee84d4ba"},{"hasChildren":true,"name":"home_loan_account","size":"","uuid":"4d1a2793-dd41-4335-b496-a7f324cd2357","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"music_solutions_transmit.shtml","size":"17.391 MB","uuid":"1d906be3-1628-40c4-b3d0-82f1cb230e45","parentUuid":"4d1a2793-dd41-4335-b496-a7f324cd2357"},{"hasChildren":false,"name":"adp.wav","size":"37.845 MB","uuid":"58986626-4526-437c-a9a0-ea926a42d62d","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"buckinghamshire_re_engineered.htm","size":"54.583 MB","uuid":"13c785b4-926b-4ecf-a84b-202d1fa57d69","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"action_items_timor_leste_1080p.wav","size":"46.289 MB","uuid":"ad5a5532-06de-4da9-a59a-04f89ec2ea50","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"system_worthy_smtp_interfaces.mpg4","size":"68.104 MB","uuid":"7d3cd7b5-6e0a-4f69-8057-4904d707994d","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":false,"name":"quantifying_redundant_pakistan.gif","size":"73.426 MB","uuid":"89ac0fcc-99b2-437b-892c-cd0c16a48577","parentUuid":"a4b8d166-178c-4cbb-b209-4a6b0174d0ea"},{"hasChildren":true,"name":"avon","size":"","uuid":"c4a0dc55-2e6c-4efa-bb9f-4cec023c5769"},{"hasChildren":true,"name":"rubber_hacking_soap","size":"","uuid":"b26fa29d-ea46-4530-89da-886b0027cc60","parentUuid":"c4a0dc55-2e6c-4efa-bb9f-4cec023c5769"},{"hasChildren":false,"name":"iowa_assurance.m2v","size":"85.804 MB","uuid":"88e52be5-b568-4dd3-8930-86b5a1907515","parentUuid":"b26fa29d-ea46-4530-89da-886b0027cc60"},{"hasChildren":true,"name":"consultant","size":"","uuid":"2b8d7f6d-ea8c-4c2e-8ce7-7167d313e2c5","parentUuid":"c4a0dc55-2e6c-4efa-bb9f-4cec023c5769"}]'
      },
      worka: {
        type: Object,
        value: [],
        notify: true
      }
    }
  }
  static get is() {
    return 'pinta-tree';
  }

  constructor() {
    super();


  }

};


// Register the x-custom element with the browser
customElements.define('pinta-tree', pintaTree);