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
        var view = resolve('monsters.html');
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

        var monsters = contentLib.query({
            query: "",
            start: 0,
            count: 999999999,
            contentTypes: [
                app.name + ":creature"
            ]
        }).hits;
        for( var i = 0; i < monsters.length; i++ ){
            monsters[i].url = portal.pageUrl({ id: monsters[i]._id });
        }

        if( up.getMonsters == 1 ){
            getMonsters( up );
        }
                        
        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            monsters: monsters,
            app: app
        };

        return model;

        function getMonsters( params ){
            var monstersLinks = dndToolsUtils.makeRequest('http://chisaipete.github.io/bestiary', {}, 'GET').body.replaceAll('\\n', '').match(/bestiary\/creatures\/.+?"/g);
            for( var i = 0; i < monstersLinks.length; i++ ){
                monstersLinks[i] = monstersLinks[i].replaceAll('\\"', '');
                if( monstersLinks[i] != 'bestiary/creatures/skyweaver' ){
                    dndToolsUtils.createCreature(createCreature(getCreatureText( 'http://chisaipete.github.io/' + monstersLinks[i])));
                }
            }
        }

        function createCreature( creatureText ){
            var mainStats = creatureText.text.split('</table>')[0].replace('<table>', '');
            mainStats = mainStats.split('</p>');
            var stats = mainStats[4].match(/[0-9]+\s/g);

            var additionalStats = creatureText.text.split('</table>')[1].split('</p>');

            var skills = "";
            var senses = "";
            var languages= "";
            var actions = false;
            var additionalSkills = [];
            var exp = '';
            var cr = '';
            var actionSkills = [];
            var armor = mainStats[1].match(/\(.+\)/g);
            if( armor ){
                armor = armor[0].replace(/\(|\)/g, '');
            } else {
                armor = "";
            }

            for( var i = 0; i < additionalStats.length; i++ ){
                additionalStats[i] = additionalStats[i].replaceAll("<[^>]*>", "").trim();
                if( additionalStats[i] == '' ){
                    additionalStats.splice(i, 1);
                    i--;
                    continue;
                }
                if( !actions ){
                    if ( additionalStats[i].match(/Skills/g) ){
                        skills = additionalStats[i].replace('Skills', "").trim();
                    } else if ( additionalStats[i].match(/Senses/g) ){
                        senses = additionalStats[i].replace('Senses', "").trim();
                    } else if ( additionalStats[i].match(/Languages/g) ){
                        languages = additionalStats[i].replace('Languages', "").trim();
                    } else if ( additionalStats[i].match(/Challenge/g) ){
                        exp = additionalStats[i].replaceAll(',', '').match(/\([0-9]+\sXP\)/g)[0].replace('(', '').replace(' XP)', '');
                        cr = additionalStats[i].replaceAll(',', '').match(/([0-9]\/)?[0-9]{1,2}\s\(/g)[0].replace('(', '').trim();
                    } else if ( additionalStats[i].match(/Actions/g) ){
                        actions = true;
                        continue;
                    } else {
                        additionalSkills.push(additionalStats[i]);
                    }
                } else {
                    actionSkills.push(additionalStats[i]);
                }
            }
            return {
                name: creatureText.name,
                size: mainStats[0].replaceAll("<[^>]*>", "").split(', ')[0].trim(),
                alignment: mainStats[0].replaceAll("<[^>]*>", "").split(', ')[1].trim(),
                ac: mainStats[1].match(/[0-9]+/g)[0],
                armor: armor,
                hp: mainStats[2].match(/[0-9]+/g)[0],
                hpDice: mainStats[2].match(/[0-9]+d[0-9]+/g)[0],
                speed: mainStats[3].replaceAll("<[^>]*>", "").replace('Speed ', ''),
                str: stats[0].trim(),
                dex: stats[1].trim(),
                con: stats[2].trim(),
                int: stats[3].trim(),
                wis: stats[4].trim(),
                cha: stats[5].trim(),
                exp: exp,
                cr: cr,
                languages: languages,
                senses: senses,
                skills: skills,
                additionalStats: additionalSkills,
                actions: actionSkills
            };
        }

        function getCreatureText( url ){
            var temp = dndToolsUtils.makeRequest(url, {}, 'GET').body.replaceAll('\\n', '').match(/<div class="post">.*?<\/div>/g)[0];
            return {
                text: temp.match(/<article.+>.*?<\/article>/g)[0],
                name: temp.match(/<h1.+>.+<\/h1>/g)[0].replaceAll("<[^>]*>", "")
            };
        }

    }

    return renderView();
}