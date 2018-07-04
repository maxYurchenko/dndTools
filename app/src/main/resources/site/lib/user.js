var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var norseUtils = require('norseUtils');
var authLib = require('/lib/xp/auth');

exports.register = function( login, mail, pass ){
  var result = true;
  var user = authLib.createUser({
      userStore: 'system',
      name: login,
      displayName: login,
      email: mail
  });
  var changePass = authLib.changePassword({
    userKey: user.key,
    password: pass
  });
  if( !user || !changePass ){
    result = false;
  }
	return result;
}

exports.login = function( login, pass){
  var user = authLib.login({
    user: login,
    password: pass,
    userStore: 'system'
  });
  return user;
}

exports.logout = function(){
  authLib.logout();
  return true;
}

exports.getCurrUser = function(){
  return authLib.getUser();
}