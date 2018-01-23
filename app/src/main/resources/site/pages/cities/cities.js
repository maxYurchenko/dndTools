var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var cityLib = require('cityLib');
var dndToolsUtils = require('dndToolsUtils');
var cityCreationUtils = require('cityCreationLib');
var helpers = require('helpers');

exports.get = handleGet;

function handleGet(req) {
    var me = this;
    var content = portal.getContent();

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
        var response = [];

        if( up.generateCity ){
            generateCity( up );
        }

        if( up.showGenerateForm ){
            var generateForm = thymeleaf.render( resolve('citiesGenerateForm.html'), {
                content: content,
            });
        }

        var cities = getCities(content._path);

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
        cityCreationUtils.createCity(params, content);
    }

    function getCities( path ){
        var cities = contentLib.query({
            query: "_parentPath LIKE '/content" + path + "*'",
            start: 0,
            count: 10,
            contentTypes: [
                app.name + ":town"
            ],
        }).hits;

        for( var i = 0; i < cities.length; i++ ){
            cities[i] = cityLib.beautifyCity(cities[i], "max(1280)", 2);
        }
    }

    return renderView();
}