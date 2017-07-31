var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var norseUtils = require('norseUtils');

exports.getPageComponents = function( req ) {
  var pageComponents = {};
  var up = req.params;
  var site = portal.getSite();  
  var siteConfig = portal.getSiteConfig();
  var content = portal.getContent();

  try{
    var menu = getMenu(norseUtils.forceArray(siteConfig.contentLocation));
  } catch ( err ){
    var menu = [];
  }

  pageComponents['header'] = thymeleaf.render( resolve('../pages/components/header.html'), {
    content: content,
    site: site
  } );


  pageComponents['pagehead'] = thymeleaf.render( resolve('../pages/components/pagehead.html'), {
    content: content
  });
  
  pageComponents['footer'] = thymeleaf.render( resolve('../pages/components/footer.html'), {
    content: content
  });  

  function getMenu( menuItems ){
    norseUtils.log(menuItems);

  }

  return pageComponents;  
};