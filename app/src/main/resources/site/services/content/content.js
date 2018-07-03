var libs = {
    norseUtils: require('norseUtils'),
    content: require('/lib/xp/content'),
    context: require('/lib/xp/context')
};
var contentLib = require('/lib/xp/content');

exports.get = function( req ) {
    var result = false;
    if ( req['params']['type'] == 'upvote' ) {
        if( req['params']['id'] ){
            result = upvote(req['params']['id']);
            syncRatingBranches(req['params']['id'], result);
        }
    } else if( req['params']['type'] == 'downvote' ) {
        if( req['params']['id'] ){
            result = downvote(req['params']['id']);
            syncRatingBranches(req['params']['id'], result);
        }
    }
    return {
        body: result,
        contentType: 'text/html'
    }
};

function upvote( path ) {
    var content = false;
    var result = libs.context.run({
        user: {
            login: 'su'
        },
        principals: ["role:system.admin"]
    }, function() {
        content = contentLib.modify({
            key: path,
            editor: function(c) {
                c.data.rating = c.data.rating + 1;
                return c;
            }
        });
    });
    return content.data.rating;
}

function downvote( path ) {
    var content = false;
    var result = libs.context.run({
        user: {
            login: 'su'
        },
        principals: ["role:system.admin"]
    }, function() {
        content = contentLib.modify({
            key: path,
            editor: function(c) {
                c.data.rating = c.data.rating - 1;
                return c;
            }
        });
    });
    return content.data.rating;
}

function syncRatingBranches( path, rating ){
    var content = false;
    var result = libs.context.run({
        user: {
            login: 'su'
        },
        principals: ["role:system.admin"]
    }, function() {
        content = contentLib.modify({
            key: path,
            branch: "draft",
            editor: function(c){
                c.data.rating = rating;
                return c;
            }
        });
    });
    return content.data.rating;
}