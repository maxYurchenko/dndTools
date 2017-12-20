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
        var view = resolve('items.html');
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
        var tempItemsLinks;
        var itemsLinks = [];
        var itemsNums;

        if( up.page ){
            parseItems(up.page);
        }

        var items = contentLib.query({
            query: "",
            start: 0,
            count: 999999999,
            contentTypes: [
                app.name + ":item"
            ]
        }).hits;
        for( var i = 0; i < items.length; i++ ){
            items[i].url = portal.pageUrl({ id: items[i]._id });
        }
        var model = {
            pageComponents: helpers.getPageComponents( req ),
            items: items,
            content: content,
            app: app
        };

        return model;

        function parseItems( page ){

            response.push(dndToolsUtils.makeRequest('https://www.dndbeyond.com/magic-items?page=' + parseInt(page), {}, 'GET').body.replaceAll('\\n', '').replaceAll('\\r', '').match(/<ul class="listing.+?<\/ul>/g)[0]);
            tempItemsLinks = response[0].match(/\/magic-items\/.+?\"/g);
            for( var j = 0; j < tempItemsLinks.length; j ++ ){
                itemsLinks.push(tempItemsLinks[j].substring(0, tempItemsLinks[j].length - 1));
            }

            for( var i = 0; i < itemsLinks.length; i++ ){
                dndToolsUtils.createItem(getItemByLink(itemsLinks[i]));
            }
        }

        function getItemByLink( url ){
            var response = dndToolsUtils.makeRequest('https://www.dndbeyond.com' + url, {}, 'GET').body.replaceAll('\\n', '').replaceAll('\\r', '');
            var itemText = response.match(/<div class="more-info-content.+?<\/div>/g);
            var itemHeading = response.match(/<div class="details.+?<\/div>/g);
            var itemTitle = response.match(/<h2 class="item-name.+?<\/h2>/g);
            if( itemHeading && itemText && itemTitle ){

                itemTitle = itemTitle[0].replaceAll("<[^>]*>", "").trim();
                var itemRarity = itemHeading[0].replaceAll("<[^>]*>", "").trim().split(', ');
                itemRarity = itemRarity[itemRarity.length - 1];
                if( itemRarity.indexOf('(') != -1 ){
                    var itemAttunement = true;
                    itemRarity = itemRarity.split('(')[0].trim();
                } else {
                    var itemAttunement = false;
                }

                var itemType = itemHeading[0].replaceAll("<[^>]*>", "").trim().split(',');
                if( itemType[0].indexOf('(') != -1 && itemType[0].indexOf(')') != -1 ){
                    var temp = itemType[0];
                    itemType = temp.split('(')[0].trim();
                    var itemTypeNote = temp.split('(')[1].replace(')').trim().replaceAll('undefined', '');
                } else if( itemType[0].indexOf('(') != -1 ){
                    var temp = itemType[0] + itemType[1];
                    itemType = temp.split('(')[0].trim();
                    var itemTypeNote = temp.split('(')[1].replace(')').trim().replaceAll('undefined', '');
                } else {
                    itemType = itemType[0].trim();
                    var itemTypeNote = "";
                }

                return {
                    title: itemTitle,
                    text: itemText,
                    rarity: itemRarity,
                    attunement: itemAttunement,
                    type: itemType,
                    typeNote: itemTypeNote
                };
            }
        }


    }

    return renderView();
}