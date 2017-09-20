var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var norseUtils = require('norseUtils');

exports.beautifyCity = function( city, imageSize, placeholderType ) {
	if( !imageSize ){
		var imageSize = "max(1920)";
	}
	if(placeholderType){
		var placeholderTYpe = 1;
	}
  	city.mainImage = norseUtils.getImage(city.data.cityImage, imageSize, placeholderType);
  	city.icon = norseUtils.getImage(city.data.cityIcon, "max(1280)", 2);
  	if( city.data.body ){
  		city.description = norseUtils.forceArray(city.data.body);
  	}
  	if( city.data.cityMap ){
	  	city.map = norseUtils.getImage(city.data.cityMap);
	}
	city.children = contentLib.query({
        query: "_parentPath = '/content" + city._path + "'",
        start: 0,
        count: 10,
        contentTypes: [
            "base:folder"
        ],
    }).hits;
    for( var i = 0; i < city.children.length; i++ ){
    	city.children[i].url = portal.pageUrl({ id: city.children[i]._id });
    }
  	city.url = portal.pageUrl({ id: city._id });
  	return city;  
};