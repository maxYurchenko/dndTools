var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var cityLib = require('cityLib');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleGet;

function handleGet(req) {
    var me = this;

    function renderView() {
        var view = resolve('cities.html');
        var model = createModel();
        var body = thymeleaf.render(view, model);
         // Return the result
        return {
          body: body,
          //contentType: 'application/json',
          contentType: 'text/html'
        };
    }

    function createModel() {

        var up = req.params;
        var content = portal.getContent();
        var response = [];
        var cities = contentLib.query({
            query: "_parentPath LIKE '/content" + content._path + "*'",
            start: 0,
            count: 10,
            contentTypes: [
                app.name + ":town"
            ],
        }).hits;

        if( up.generateCity ){
            generateCity( up );
        }

        if( up.showGenerateForm ){
            var generateForm = thymeleaf.render( resolve('citiesGenerateForm.html'), {
                content: content,
            });
        }

        for( var i = 0; i < cities.length; i++ ){
            cities[i] = cityLib.beautifyCity(cities[i], "max(1280)", 2);
        }

        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            cities: cities,
            generateForm: generateForm,
            app: app
        };

        return model;


    }

    function generateCity( params ){
        if(isNaN( parseInt(params.human))){
            params.human = 0;
        }
        if(isNaN( parseInt(params.halfelf))){
            params.halfelf = 0;
        }
        if(isNaN( parseInt(params.halforc))){
            params.halforc = 0;
        }
        if(isNaN( parseInt(params.halfling))){
            params.halfling = 0;
        }
        if(isNaN( parseInt(params.dwarf))){
            params.dwarf = 0;
        }
        if(isNaN( parseInt(params.gnome))){
            params.gnome = 0;
        }
        if(isNaN( parseInt(params.elf))){
            params.elf = 0;
        }
        if( ((parseInt(params.human) + parseInt(params.halfelf) + parseInt(params.halfling) + parseInt(params.halforc) +
            parseInt(params.dwarf) + parseInt(params.gnome) + parseInt(params.elf)) == 100) ) {
            var cityParams = {
                name: params.name,
                size: params.size,
                dwarf: params.dwarf,
                elf: params.elf,
                gnome: params.gnome,
                halfelf: params.halfelf,
                halfling: params.halfling,
                halforc: params.halforc,
                human: params.human,
                children: params.children,
                mountains: params.mountains,
                military: params.military,
                port: params.port,
                agricultural: params.agricultural,
                forest: params.forest
            };
        }
        else{
            var cityParams = {
                name: params.name,
                size: params.size,
                dwarf: '8',
                elf: '7',
                gnome: '5',
                halfelf: '5',
                halfling: '10',
                halforc: '5',
                human: '60',
                children: ''
            };
        }
    }

    return renderView();
}