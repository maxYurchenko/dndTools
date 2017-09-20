var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');
var cityLib = require('cityLib');
var helpers = require('helpers');

exports.get = handleGet;

function handleGet(req) {
    var me = this;

    function renderView() {
        var view = resolve('city.html');
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
        content = cityLib.beautifyCity(content, false, 1);
        content.powerCenter = norseUtils.forceArray(content.data.powerCenter);
        var header = {
            image: content.mainImage.url,
            title: content.displayName
        };

                        
        var model = {
            pageComponents: helpers.getPageComponents( req, header ),
            content: content,
            app: app
        };

        return model;


    }

    return renderView();
}