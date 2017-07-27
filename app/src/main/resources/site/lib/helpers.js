var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var libs = {
    norseUtils: require('norseUtils')
};

exports.getPageComponents = function( req ) {
  var pageComponents = {};
  var up = req.params;
  var site = portal.getSite();  
  var siteConfig = portal.getSiteConfig();
  var content = portal.getContent();

  pageComponents['header'] = thymeleaf.render( resolve('../pages/components/header.html'), {
    content: content
  } );


  pageComponents['pagehead'] = thymeleaf.render( resolve('../pages/components/pagehead.html'), {
    content: content
  });
  
  pageComponents['footer'] = thymeleaf.render( resolve('../pages/components/footer.html'), {
    content: content
  });  

  return pageComponents;  
};