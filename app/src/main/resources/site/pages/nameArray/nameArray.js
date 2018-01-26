var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleGet;

//var nm1 =
//var nm2 =
//var nm3 = ["Amulet","Angel","Artifact","Banshee","Basilisk","Beacon","Bigfoot","Blade","Book","Boots","Branch","Bunyip","Cauldron","Centaur","Cerberus","Chimera","Chupacabra","Cloak","Cockatrice","Codex","Crown","Cupid","Cyclops","Demon","Dragon","Draugr","Dryad","Dwarf","Elemental","Elf","Ent","Fairy","Faun","Feathered Serpent","Focus","Gargoyle","Gauntlet","Genie","Ghost","Giant","Gnome","Gorgon (Medussa)","Gremlin","Griffin","Grim Reaper","Hag","Harpy","Hellhound","Hippocampus","Hippogriff","Hobbit","Hobgoblin","Hourglass","Human","Hydra","Imp","Incubus/Succubus","Jackalope","Key","Kobold","Kraken","Leprechaun","Lich","Lute","Manticore","Marker","Mermaid","Minotaur","Mummy","Naga","Nymph","Ogre","Orb","Pegasus","Phoenix","Pixie","Poltergeist","Quill","Ring","Robe","Roc","Rune","Sandman","Sasquatch","Satyr","Scepter","Scroll","Seal","Shapeshifter","Shield","Siren","Skeleton","Skull","Sphere","Sphinx","Spriggan","Sprite","Staff","Stone","Sword","Talisman","Tiara","Tome","Troll","Unicorn","Valkyrie","Vampire","Vial","Wand","Wendigo","Werecat","Werewolf","White Stag","Winged Lion","Winged Unicorn","Wisp","Wolpertinger","World Turtle","Wraith","Wyvern","Yeti","Zombie"];

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

    function editor(c) {
        c.data.firstName.first = nm1;
        c.data.lastName.first = nm2;
        //c.data.lastName.second = nm3;
        return c;
    }

    return renderView();
}