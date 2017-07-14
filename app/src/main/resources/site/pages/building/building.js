/* 
 * @author: Aleksandr Pilyavskiy <spi@norse.digital>
 * @copyright Copyright (C) 2016 Norse Digital.
 * @date: Dec 09, 2016
 */


var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');

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
                        
        var model = {
            content: content,
            app: app
        };

        return model;
    }

    return renderView();
}