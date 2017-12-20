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
	city.children = this.getChildren(city._path, ["base:folder"]);
    for( var i = 0; i < city.children.length; i++ ){
    	city.children[i].url = portal.pageUrl({ id: city.children[i]._id });
		city.children[i].children = this.getChildren(city.children[i]._path, ["base:folder"]);
    	for( var j = 0; j < city.children[i].children.length; j++ ){
    		city.children[i].children[j].url = portal.pageUrl({ id: city.children[i].children[j]._id });
    	}
    }
  	city.url = portal.pageUrl({ id: city._id });
  	return city;
};

exports.getChildren = function( path, types ){
	return contentLib.query({
        query: "_parentPath = '/content" + path + "'",
        start: 0,
        count: 10,
        contentTypes: types
    }).hits;
}
