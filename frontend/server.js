// Node.js notation for importing packages
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require("path");
var moment = require("moment");
var Promise = require("promise");
var cors = require('cors');
var arraySort = require('array-sort');
const crypto = require("crypto");
//var app = express();

//var XLSX = require("xlsx");
var readFile_promise = Promise.denodeify(require('fs').readFile);
var tablas;

// Spin up a server
var app = express();
app.use(cors());

function parseoGenerico(linea) {
    l = linea.split(' ');
    //console.log(l);
    if (l.length > 3) {
        var inicio = linea.lastIndexOf("S (") + 3;
        var final = linea.lastIndexOf(");");
        var datos = linea.slice(inicio, final).replace(/'/g, '').split(',');
        var inicioCampos = 25;
        var finCampos = linea.lastIndexOf("VALUES");
        var campos = linea.slice(inicioCampos, finCampos).replace('(', '').split(',');
        campos[campos.length-1] = campos[campos.length-1].replace(')','');
        //console.log("linea :"+i + "->"+l[2]);
        var nomTabla = (l[2].slice(0, 13)).split(".")[1].slice(4,8);
        if(campos.length != datos.length) {
            console.log( "error parseando. Numero de campos o de valores no cuadran:"+linea);
            return;
        }
        var e = {};
        for(var n=0;n<campos.length;n++){
            e[campos[n].trim()]=datos[n].trim();
        }
        if (tablas[nomTabla] === undefined) {
            tablas[nomTabla] = [];
        };
        tablas[nomTabla].push(e);
        
    }
}
function getFileRealPath(s) {
    try {
        return fs.realpathSync(s);
        
    } catch (e) {
        return false;
    }
}
function findData(element, index, array) {
    return retornoU[x].fecha = retorno[index].fecha;
}
function findDescAAP(aap) {

    for (var i = 0; i < tablas.maap.length; i++) {
        if (tablas.maap[i].cod_aap === aap) {
            return tablas.maap[i].des_daap;
        }
    }
}
function buscaCampo(matriz, campo, valor) {
    var r ;
    for (var i = 0; i < matriz.length; i++) {
        if (matriz[i][campo] === valor) {
            r = matriz[i];
            break;
        }
    }
    return r;
}
function parseoFecha(fechaW) {
    var hoy = moment(fechaW);
    console.log("resultado parseo fecha:" + hoy);

    if (!hoy.isValid) {
        hoy = moment();
    };

    console.log("fecha con la que hago el query:" + hoy);
    //var fecha = hoy.getDate() +"-" + hoy.getMonth() + "-" + hoy.getFullYear();
    var fecha = hoy.format('DD-MM-YYYY');
    return fecha;
};

function loadDatos() {

    var promises = [];

    console.log("entrando a loadDatos");

    var logs = require.resolve(__dirname + '/ksjm-script_ConsolaPRO.sql');

    promises.push(readFile_promise(logs, 'UTF8'));

    Promise.all(promises).then(function (results) {

        console.log("bytes leidos:" + results[0].length);

        const lines = results[0].split('\n');
        tablas = {
            etiquetas: [],
            arbolAgrupas: [], // estructura en arbol para las agrupaciones de magr,maag y maap
//            maag: [], // AAP
            magr: [], // Agrupaciones
  //          maap: [], //AAP
            // mcol: [], // Colectivos
            // mtap: [], //TipoApplicationAccessPoint
            // meac: [], // EstadoActivacion
            // mapg: [], //TipoAapGlobal
            // maos: [], // OrigenesSTS
            // mser: [], // ServicioPublico
            // msep: [], // ServicioPublico
            // mtsp: [], // TipoServicioPublico
            // msop: [], // ServicioPrivado
            // mspr: [], // ServicioPrivado
            // mope: [], // Operativa
            mava: [], // ServicioPrivado Validaciones
            // mase: [], // AutorizacionConsumoServicio
            // mval: [],  // validaciones(definiciones)
            // mvap: [],  // validaciones aap
            // mbac: [], // backend
            // mmov: [], // Mobilidad
            // mutr: [], // Usuario Transaccional
            // msma: [], // Junction SMA
            // mefr: [],  // EstadoFraude
            // meti: [], // Etiqueta
            // mece: [], // conjunto etiquetas
            // mfam: [],  // clase etiqueta
            // mecs: [],   // Proceso cambio de estado
            // meva: [], // codigo evaluacion
            mcau: [],  // controlador autenticacion
            smc2aap: [] // tablas donde para cada smc se enumeran las aap que lo pueden consumir
        };
        
        for (i = 0; i < lines.length; i++) {
            
            l = lines[i].split(' ');
            if (l.length > 2) {
                inicio = lines[i].lastIndexOf("S (") + 3;
                final = lines[i].lastIndexOf(");");
                datos = lines[i].slice(inicio, final).replace(/'/g, '').split(',');
                
                
                //console.log("linea :"+i + "->"+l[2]);
                switch (l[2].slice(0, 13)) {
                    case 'ksjm.tksjmcau':
                        datosC = lines[i].slice(inicio, final).split("'");
                        tablas.mcau.push({
                            "cod_cca": datos[0].trim(), 
                            "cod_eac": datos[1].trim() , 
                            "des_dca":datosC[5].trim() , 
                            "des_cpp": datosC[7].trim(), 
                            "des_cac": datos[4].trim(), 
                            "qnu_ver":datos[5].trim(), 
                            "xti_mgu":datos[6].trim()
                        })                    
                    break;
                    case 'ksjm.tksjmagr':
                        tablas.magr.push({
                            "cod_agrupaap": datos[0].trim(),
                            "des_agrupaap": datos[1].trim(),
                            "qnu_ver": datos[2].trim(),
                            "aaps": []
                        })
                    break;
                    case 'ksjm.tksjmava':
                        if(datos[0] === "FRA") {
                        var wmava = datos[1].trim()+","+
                                    datos[2].trim()+","+
                                    datos[3].trim()+","+
                                    datos[4].trim()+","+
                                    datos[5].trim()+","+
                                    datos[6].trim()+","+
                                    datos[7].trim();     
                        tablas.mava.push({
                            "cod_vlo": datos[0].trim(),
                            "des_paval": wmava, 
                            "cod_sop": datos[8].trim(),
                            "cod_aap": datos[9].trim()
                        })
                    } else {
                        tablas.mava.push({
                            "cod_vlo": datos[0].trim(),
                            "des_paval": datos[1].trim(),
                            "cod_sop": datos[2].trim(),
                            "cod_aap": datos[3].trim()
                        })
                    }

                        break;
                
                    default:
                    parseoGenerico(lines[i]);
                }
            }
        }
        /*
        Ahora que ya he parseado las tablas, 
        añado en magr la lista de aap que pertenecen a esa agrupacion
        Las agrupaciones estan definidas en maag
        */
        arraySort(tablas.maag, ['cod_agrupaap', 'cod_aap']);
        arraySort(tablas.magr, 'cod_agrupaap');
        arraySort(tablas.maap, 'cod_aap');
        for (var n = 0; n < tablas.maag.length; n++) {
            //console.log("repasant aap:"+tablas.maag[n].cod_aap);
            for (nn = 0; nn < tablas.magr.length; nn++) {
                 //console.log("repasant agrupacion:"+tablas.magr[nn].cod_agrupaap);
                if (tablas.magr[nn].cod_agrupaap == tablas.maag[n].cod_agrupaap) {

                    //var desc = findDescAAP(tablas.maag[n].cod_aap);
                    var desc = buscaCampo(tablas.maap, "cod_aap", tablas.maag[n].cod_aap);
                    // console.log("encontrado descripcion de la aap:"+desc.des_daap);
                    //console.log("En findDescAAP he encontrado:"+desc+" y en findCampo :"+workac.des_daap);
                    //tablas.magr[nn].aaps.push(tablas.maag[n].cod_aap);
                     var tipoAAP =    buscaCampo(tablas.mtap, "cod_taap", desc.cod_taap);
                    //  console.log("encontrado descripcion del tipo de aap:"+tipoAAP.des_taap);
                     var tipoCol =    buscaCampo(tablas.mcol, "cod_ncol", desc.cod_ncol);
                    //  console.log("encontrado descripcion del tipo de colectivo:"+tipoCol.des_nco);
                     var tipoAct =    buscaCampo(tablas.meac, "cod_eac", desc.cod_eac);
                    //  console.log("encontrado descripcion del estado:"+tipoAct.des_nest);
                     
                    tablas.magr[nn].aaps.push({
                        "aapN":desc.cod_aap + "-" + desc.des_daap,
                        "aapT":desc.cod_taap + "-" + tipoAAP.des_taap,
                        "aapC": desc.cod_ncol + "-" + tipoCol.des_nco,
                        "aapA": desc.cod_eac + "-" + tipoAct.des_nest
                        
                     });

                }

            }

        };
        
        //
        // creo arbolAgrupas
        //
        var numHijos = 0;
        var id_l1 = null;
        var id_l2 = null;
        var id_l3 = null;
        var desc = "";
        for(var n=0;n<tablas.magr.length;n++) {
            id_l1 = crypto.randomBytes(16).toString("hex");
            tablas.arbolAgrupas.push({
                "name": tablas.magr[n].cod_agrupaap,
                "parentUuid": null,
                "hasChildren": true,
                "numHijos": tablas.magr[n].aaps.length,
                "uuid": id_l1
            })
            //{"hasChildren":true,"name":"borders","size":"5","uuid":"9cccd424-3cdf-42e1-9087-a5bc51808700"}
            for(nn=0;nn<tablas.magr[n].aaps.length;nn++){
                id_l2 = crypto.randomBytes(16).toString("hex");
                //desc = buscaCampo(tablas.arbolAgrupas, "name", tablas.magr[n].cod_agrupaap);
                tablas.arbolAgrupas.push({
                    "name": tablas.magr[n].aaps[nn].aapN,
                    "parentUuid": id_l1,
                    "hasChildren": true,
                    "numHijos":1,
                    "uuid": id_l2
                });
                id_l3 = crypto.randomBytes(16).toString("hex");
                tablas.arbolAgrupas.push({
                    "name": tablas.magr[n].aaps[nn].aapT,
                    "parentUuid": id_l2,
                    "hasChildren": false,
                    "numHijos":0,
                    "uuid": id_l3
                });
                id_l3 = crypto.randomBytes(16).toString("hex");
                tablas.arbolAgrupas.push({
                    "name": tablas.magr[n].aaps[nn].aapC,
                    "parentUuid": id_l2,
                    "hasChildren": false,
                    "numHijos":0,
                    "uuid": id_l3
                });
                id_l3 = crypto.randomBytes(16).toString("hex");
                tablas.arbolAgrupas.push({
                    "name": tablas.magr[n].aaps[nn].aapA,
                    "parentUuid": id_l2,
                    "hasChildren": false,
                    "numHijos":0,
                    "uuid": id_l3
                });

            };
        };



        //
        //busco para cada validacion el codigo de operacion y la app
        // busco para cada codigo de validacion su descripcion para que sea legible
        //
        for (i = 0; i < tablas.mava.length; i++) {
            var descVal =   buscaCampo(tablas.mval,"cod_vlo",tablas.mava[i].cod_vlo);
            // console.log("Encontrado descripcion validacion:"+descVal.des_nval);
            var oper = buscaCampo(tablas.msop,"cod_sop",tablas.mava[i].cod_sop);
            // console.log("Encontrado cod_sr:"+oper.cod_sr);
            var servicio = buscaCampo(tablas.mser,"cod_sr",oper.cod_sr);
            // console.log("Encontrado servicio:"+servicio.cod_sn+"-"+servicio.cod_smc);
            var estado = buscaCampo(tablas.meac,"cod_eac",servicio.cod_eac);
            // console.log("Encontrado estado:"+estado.des_nest);
            var aap = buscaCampo(tablas.maap,"cod_aap",tablas.mava[i].cod_aap);
            // console.log("Encontrado aap:"+aap.des_daap);
            //tablas.mava[i].cod_vlo = tablas.mava[i].cod_vlo + "-" + descVal.des_nval;
            tablas.mava[i].cod_vlo = tablas.mava[i].cod_vlo + "-" + descVal.des_nval;
            tablas.mava[i].cod_sop = tablas.mava[i].cod_sop + "-" + servicio.cod_sn + "-" + servicio.cod_smc + "-" + "Estado:" + estado.des_nest;
            tablas.mava[i].cod_aap = tablas.mava[i].cod_aap + "-" + aap.des_daap;
            
            
        }
       
       
        arraySort(tablas.mase, 'cod_politaut');
        arraySort(tablas.mpla, 'cod_politaut');
        for(i=0;i<tablas.mase.length;i++){
            //
            //si es privado esta aqui
            //
            var pMSOP = buscaCampo(tablas.msop,"cod_sop",tablas.mase[i].cod_sop);
            var pMSER = buscaCampo(tablas.mser,"cod_sr",pMSOP.cod_sr);
            //
            // si es publico esta aqui
            //
            var pMSEP = buscaCampo(tablas.msep,"cod_sr",pMSER.cod_sr);
           
            var smc = buscaCampo(tablas.mope,"cod_opt",pMSOP.cod_opt);

            var nombreSMC = "";
            for(x=0;x<tablas.mpla.length;x++){
                if(tablas.mase[i].cod_politaut == tablas.mpla[x].cod_politaut) {
                    var colectivo = buscaCampo(tablas.mcol,"cod_ncol",tablas.mpla[x].cod_ncol);
                    var nombreSMC = "";
                    if(smc.des_nop == "NONE") {
                        nombreSMC = tablas.mase[i].cod_sop +"-"+ pMSER.cod_smc;
                    } else {
                        nombreSMC = tablas.mase[i].cod_sop+"-"+smc.des_nop;
                    }
                    
                    var pMEAC = buscaCampo(tablas.meac,"cod_eac",tablas.mase[x].cod_eac);                                       
                    tablas.smc2aap.push({
                        "cod_sop": nombreSMC, 
                        "estado": pMEAC.des_nest,
                        "politica": tablas.mpla[x].cod_politaut,
                        "des_nompolit" : tablas.mpla[x].des_nompolit,
                        "des_pol" : tablas.mpla[x].des_pol,
                        "cod_ncol": tablas.mpla[x].cod_ncol+"-"+colectivo.des_nco
                        //         "estado_activacion": estado.cod_eac+"-"+estado.des_nest.trim(),
                        //         "estado_ejecucion": fraude.cod_esf+"-"+fraude.des_nef.trim(),
                        //         "politica": politica.cod_politaut+"-"+politica.des_nompolit.trim(),
                        //         "colectivo": colectivo.cod_ncol+"-"+colectivo.des_nco
                    })    
                }
            }
        }
        for(x=0;x<tablas.msep.length;x++){
            
            var pMSER = buscaCampo(tablas.mser,"cod_sr",tablas.msep[x].cod_sr);
            var pMTSP = buscaCampo(tablas.mtsp,"cod_tsp",tablas.msep[x].cod_tsp);
            var pMEAC = buscaCampo(tablas.meac,"cod_eac",pMSER.cod_eac);

            tablas.smc2aap.push({
                "cod_sop": pMSER.cod_sr+"-"+pMSER.cod_smc, 
                "estado": pMEAC.cod_eac+"-"+pMEAC.des_nest,
                "politica": "SERVICIO PUBLICO",
                "des_nompolit" : pMTSP.cod_tsp+"-"+pMTSP.des_nsp,
                "des_pol" : "",
                "cod_ncol": ""
                //         "estado_activacion": estado.cod_eac+"-"+estado.des_nest.trim(),
                //         "estado_ejecucion": fraude.cod_esf+"-"+fraude.des_nef.trim(),
                //         "politica": politica.cod_politaut+"-"+politica.des_nompolit.trim(),
                //         "colectivo": colectivo.cod_ncol+"-"+colectivo.des_nco
            })    
        }
        
        loadEtiquetas();
        
        for(x=0;x<tablas.meti.length;x++){
            var pMETI = buscaCampo(tablas.mfam,"cod_fml",tablas.meti[x].cod_fml);
            var pMEFR = buscaCampo(tablas.mefr,"cod_esf",tablas.meti[x].cod_esf);
            var pMCOL = buscaCampo(tablas.mcol,"cod_ncol",tablas.meti[x].cod_ncol);
            tablas.meti[x].cod_fml = tablas.meti[x].cod_fml + "-" + pMETI.des_nomf;            
            tablas.meti[x].cod_esf = tablas.meti[x].cod_esf + "-" + pMEFR.des_nef;            
            tablas.meti[x].cod_ncol = tablas.meti[x].cod_ncol + "-" + pMCOL.des_nco;            
        }
        arraySort(tablas.mava, 'cod_sop');
        arraySort(tablas.mase, 'cod_sop');
        arraySort(tablas.mcau, 'cod_cca');
        arraySort(tablas.mspr, 'cod_sr');
        arraySort(tablas.mope, 'cod_opt');
        arraySort(tablas.mpla, 'cod_poliaut');
        arraySort(tablas.mefr, 'cod_esf');
        arraySort(tablas.mtsp, 'cod_tsp');
        arraySort(tablas.smc2aap, 'cod_sop');

        
      
        console.log("Final del parseo correcto.lineas leidas:" + lines.length);
        return;
        //return res.send(JSON.stringify(retorno));

    }, function (error) {
        console.log("Error reading files");
    });

}
function loadEtiquetas() {
    
        var promises = [];
    
        console.log("entrando a loadEtiquetas");
       
        var logs = require.resolve(__dirname + '/clientesParticulares.csv');
    
        promises.push(readFile_promise(logs, 'UTF8'));
    
        Promise.all(promises).then(function (results) {
    
            console.log("bytes leidos Etiquetas:" + results[0].length);
    
            const lines = results[0].split('\n');
            for(var n=2; n< lines.length;n++) {
                var valores = lines[n].split(',');
                if(valores[1].length > 5) {
                    console.log("etiqueta:"+valores[5]+" significa:"+valores[1]);
                    tablas.etiquetas.push({
                        "cod_etiqueta": valores[5].trim(),
                        "des_etiqueta": valores[1].trim()
                    });                  
                };
            }
          
    
            console.log("Final del parseo correcto.lineas leidas de etiquetas:" + lines.length);
    
            return;
            //return res.send(JSON.stringify(retorno));
    
        }, function (error) {
            console.log("Error reading fichero Etiquetas");
        });
    
    }
// Serve static files from the main build directory
var dirbase = __dirname + '/build/es6-bundled';
app.use(express.static(dirbase));
loadDatos();

// Render index.html on the main page, specify the root
app.get('/', function (req, res) {
    res.sendFile("index.html", {
        root: '.'
    });
});
app.get('/agrupa', function (req, res) {
    //console.log("Entrando a agrupa");  
    return res.send(JSON.stringify(tablas.magr));
}, function (error) {
    console.log("Error devolviendo la tabla agrupa");
});
app.get('/arbolAgrupas', function (req, res) {
    console.log("Entrando a ArbolAgrupa");  
    return res.send(JSON.stringify(tablas.arbolAgrupas));
}, function (error) {
    console.log("Error devolviendo la tabla ArbolAgrupa");
});
//http://localhost:3000/tablas?tabla=meti
app.get('/tablas', function (req, res) {
    console.log("ENTRANDO EN tablas CON :" + req.query.tabla);
    return res.send(JSON.stringify(tablas[req.query.tabla]));
}, function (error) {
    console.log("Error devolviendo la tabla"+req.query.tabla);
});
//http://localhost:3000/buscaAAP?colectivo=EMP
app.get('/buscaAAP', function (req, res) {
    console.log("ENTRANDO EN buscaAAP CON :" + req.query.colectivo);
    var aaps = [];
    for(var x=0;x<tablas.maap.length;x++){
        if(tablas.maap[x].cod_ncol == req.query.colectivo )
            {
                aaps.push(tablas.maap[x].cod_aap+"-"+tablas.maap[x].des_daap);
            }
    };
    return res.send(JSON.stringify(aaps));
}, function (error) {
    console.log("Error devolviendo la tabla"+req.query.tabla);
});
//mcol:[],mtap:[],meac:[],mapg:[],maos:[]    
// Tell the app to listen    for requests on port 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});