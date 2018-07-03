var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleReq;

exports.post = handleReq;

function handleReq(req) {
    var me = this;

    function renderView() {
        var view = resolve('user.html');
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
        var pageParams = processParams(up);
        var model = {
            url: portal.pageUrl({ path: content._path }),
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            pageParams: pageParams,
            app: app
        };

        return model;
    }

    function processParams( params ){
        var register = false;
        var login = false;
        if( params.login && params.password && params.email ){
            norseUtils.log(params);
        }
        if( params.register ){
            register = thymeleaf.render(resolve('register.html'), {});
        }
        if( params.login ){
            login = thymeleaf.render(resolve('login.html'), {});
        }
        return {
            login: login,
            register: register
        }
    }
    return renderView();
}