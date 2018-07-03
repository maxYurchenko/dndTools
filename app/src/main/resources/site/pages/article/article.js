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
        var view = resolve('article.html');
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
        //dndToolsUtils.makeRequest( req.scheme + "://" + req.host + '/_/service/com.myurchenko.dndTools/content?type=rating&id=' + content._path, {}, 'GET');

        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            mainRegion: content.page.regions['main'],
            app: app,
            downvoteUrl: req.scheme + "://" + req.host + '/_/service/com.myurchenko.dndTools/content?type=downvote&id=' + content._path,
            upvoteUrl: req.scheme + "://" + req.host + '/_/service/com.myurchenko.dndTools/content?type=upvote&id=' + content._path
        };

        return model;


    }

    return renderView();
}