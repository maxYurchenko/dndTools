var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleGet;

//var names = ["Arjhan","Balasar","Bharash","Donaar","Ghesh","Heskan","Kriv","Medrash","Mehen","Nadarr","Pandjed","Patrin","Rhogar","Shamash","Shedinn","Tarhun","Torinn","Akra","Biri","Daar","Farideh","Harann","Havilar","Jheri","Kava","Korinn","Mishann","Nala","Perra","Raiann","Sora","Surina","Thava","Uadjit","Aera","Aial","Aur","Deekek","Errk","Heehk","Ikki","Kleeck","Oorr","Ouss","Quaf","Quierk","Salleek","Urreek","or Zeed","Akmenos","Amnon","Barakas","Damakos","Ekemon","Iados","Kairon","Leucis","Melech","Mordai","Morthos","Pelaios","Skamos","Therai","Akta","Anakis","Bryseis","Criella","Damaia","Ea","Kallista","Lerissa","Makaria","Nemeia","Orianna","Phelaia","Rieta","Aukan","Eglath","Gae-Al","Gauthak","Ilikan","Keothi","Kuori","Lo-Kag","Manneo","Maveith","Nalla","Orilo","Paavu","Pethani","Thalai","Thotham","Uthal","Vaunea","Vimak"];
//var names2 = ["Anakalathai","Elanithino","Gathakanathi","Kalagiano","Katho-Olavi","Kolae-Gileana","Ogolakanu","Thuliaga","Thunukalathi","Vaimei-Laga","Art","Carrion","Chant","Creed","Despair","Excellence","Fear","Glory","Hope","Ideal","Music","Nowhere","Open","Poetry","Quest","Random","Reverence","Sorrow","Temerity","Torment","Weary","Clethtinthiallor","Daardendrian","Delmirev","Drachedandion","Fenkenkabradon","Kepeshkmolik","Kerrhylon","Kimbatuul","Linxakasendalor","Myastan","Nemmonis","Norixius","Ophinshtalajiir","Prexijandilin","Shestendeliath","Turnuroth","Verthisathurgiesh","Yarjerit"];

function handleGet(req) {
    var me = this;

    function renderView() {
        var view = resolve('nameArray.html');
        var model = createModel();
        var body = thymeleaf.render(view, model);
        return {
          body: body,
          contentType: 'text/html'
        };
    }

    function createModel() {

        var up = req.params;
        var content = portal.getContent();
        var response = [];
        /*var result = contentLib.modify({
            key: content._id,
            editor: editor
        });*/

        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            app: app
        };

        return model;


    }

    /*function editor(c) {
        c.data.firstName.first = names;
        c.data.lastName.first = names;
        return c;
    }*/

    return renderView();
}