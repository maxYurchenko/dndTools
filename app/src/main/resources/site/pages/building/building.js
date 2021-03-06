var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleGet;

function handleGet(req) {
    var me = this;

    function renderView() {
        var view = resolve('building.html');
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

        content.data.staff = norseUtils.forceArray(content.data.staff);
        for( var i = 0; i < content.data.staff.length; i++ ){
            content.data.staff[i].url = portal.pageUrl({ id: content.data.staff[i].id });
            content.data.staff[i].name = contentLib.get({ key: content.data.staff[i].id }).displayName;
        }
        norseUtils.log(content.data.staff);
                        
        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            app: app
        };

        return model;
    }

    return renderView();
}