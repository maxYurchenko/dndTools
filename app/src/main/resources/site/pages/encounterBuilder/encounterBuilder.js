var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');

exports.get = handleGet;

function handleGet(req) {
    var me = this;

    function renderView() {
        var view = resolve('encounterBuilder.html');
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
        var monsters = contentLib.query({
            query: '',
            start: 0,
            count: 99999999,
            contentTypes: [
                app.name + ":creature"
            ],
        }).hits;

        var up = req.params;
        var content = portal.getContent();
                        
        var model = {
            content: content,
            app: app,
            monsters: JSON.stringify(monsters, null, 4),
        };

        return model;
    }

    return renderView();
}