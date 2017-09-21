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
        var view = resolve('home.html');
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

        norseUtils.log(up);

        if( up.generate == 1 ){
            generateCity( up );
        }

        var model = {
            content: content,
            pageComponents: helpers.getPageComponents( req ),
            app: app
        };

        return model;
    }

    return renderView();

    function generateCity( params ){
        var cityParams = {
            Name: "Waterdeep",
            Size: 'Neverwinter',
            Dwarf: '8',
            Elf: '7',
            Gnome: '5',
            Halfelf: '5',
            Halfling: '10',
            Halforc: '5',
            Human: '60',
            Children: '',
            Send: 'Submit'
        };

        var response = dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/db.php', cityParams, 'POST'));

        var city = getCityAttributes(response);
        var captain = getPeople(response[0]);
        var guardsLink = response[0].split('</table>')[1].match(/Output.php\?.*?NUM.*(=|[0-9])/g);
        var guards = dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/' + guardsLink, {}, 'POST'));

        guards = getPeople(guards[0]);

        var populationLinks = getPeoppleLinks(response);
        var population = getPeopleFromLinks(populationLinks);
        population.Guards = guards;
        var buildings = getBuildingsLinks(response);
        dndToolsUtils.createCity(city, population, buildings);
    }

    function getCityAttributes( response ){
        var city = {
            powerCenters: []
        };
        for( var i = 0; i < 25; i++ ){
            if( i == 0 ){
                city.title = response[0].replace(/.*of\s/g, '');
                continue;
            }
            if( response[i].indexOf('Power Center:') != -1 ){
                city.powerCenters.push({
                    title: response[i].replace(/Power Center:/g, '').trim(),
                    alignment: response[i+1].replace(/Alignment:/g, '').trim()
                });
            }
            if( response[i].indexOf('Population:') != -1 ){
                city.population = response[i].match(/[0-9]+/g, '')[0];
            }
            if( response[i].indexOf('GP Limit:') != -1 ){
                city.gpLimit = response[i].match(/[0-9]+/g, '')[0];
            }
            if( response[i].indexOf('Community Wealth:') != -1 ){
                city.communityWealth = response[i].match(/[0-9]+/g, '')[0];
                response.splice(0, i + 2);
                break;
            }
        }
        return city;
    }

    function getPeople( peopleString ){
        var tempPeople = peopleString.split('</table>')[0].replace(/.*?<table.*?>/g, '').split('</td>');
        var preparedPeople = [];
        var people = [];
        for( var i = 0; i < tempPeople.length; i++ ){
            tempPeople[i] = tempPeople[i].replace(/\n|\t|<.*?>/g, '').trim();
            if( tempPeople[i] != "" ){
                preparedPeople.push(tempPeople[i]);
            }
        }
        if(preparedPeople.length > 5){
            for( var i = 0; i < preparedPeople.length; i+=7 ){
                people.push({
                    name: preparedPeople[i],
                    race: preparedPeople[i+1],
                    sex: preparedPeople[i+2],
                    class: preparedPeople[i+3],
                    level: preparedPeople[i+4],
                    role: preparedPeople[i+5],
                    habit: preparedPeople[i+6]
                });
            }
        }
        return people
    }

    function getPeoppleLinks( response ){
        var roles = ['Militia', 'Warriors', 'Experts', 'Adepts', 'Aristocrats', 'Barbarians', 'Bards', 'Clerics', 
            'Druids', 'Fighters', 'Monks', 'Paladins', 'Rangers', 'Rogues', 'Sorcerers', 'Wizards', 'Commoners'];
        var links = {};
        for( var i = 0; i < 17; i++ ){
            links[roles[i]] = response[i+1].match(/Output.php\?.*?NUM.*(=|[0-9])/g);
        }
        response.splice(0, 18);
        return links;
    }

    function getPeopleFromLinks( links ){
        var population = {};
        for (var role in links) {
            if (links.hasOwnProperty(role)) {
                population[role] = getPeople(dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/' + links[role], {}, 'POST'))[0]);
            }
        }
        return population;
    }

    function getBuildingsLinks( response ){
        var buildingsListLinks = {};
        var buildings = {};
        for( var i = 0; i < response.length; i++ ){
            if( response[i].match(/\*.*view all\s/g) ){
                var link = response[i].match(/Output.php\?.*?(NUM|type).*(=|[0-9])/g)[0];
                /****************************
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                TODO: REGEX RETURNS UNDEFINED
                    REPLACEALL INCORRECT
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                ****************************/
                var title = response[i].replace(/\*+\<a.+>.+view all\s|\<\/\a\>\*+/g).replaceAll('undefined', '');
                //buildingsListLinks[title] = link;
                buildings = getBuildingsList( title, link, buildings );
                //buildingsListLinks[title].push();
            }
        }
        return buildings;
    }

    function getBuildingsList( title, url, buildings ){
        var buildingList = dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/' + url, {}, 'POST'));
        var buildingsLink = [];
        if( !buildings[title] ){
            buildings[title] = [];
        }
        for( var i = 0; i < buildingList.length; i++ ){
            buildingsLink.push(buildingList[i].match(/Output.php\?.*?(NUM|type).*(=|[0-9])/g)[0]);
        }
        for( var i = 0; i < buildingsLink.length; i++ ){
            var temp = dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/' + buildingsLink[i], {}, 'POST'));
            if( title != 'Taverns'){
                buildings[title].push(getBuildings(temp));
            }else{
                buildings[title].push(getTaverns(temp));
            }
        }
        return buildings;
    }

    function getBuildings( buildingText ){
        var building = {
            title: buildingText[0],
            type: buildingText[1],
            price: buildingText[2].match(/[0-9|%]+/g)[0],
            lunchTime: buildingText[3].split('</table>')[1].match(/[0-9]{1,2}:[0-9]{2}.{7,10}[0-9]:[0-9]{2}/g)[0],
            staff: getPeople(buildingText[3])
        };
        var temp = buildingText[3].split('</table>')[1];
        building.lunchOpen = temp.indexOf('eat lunch at') == -1 ? "Open" : temp.replace(/.*eat lunch at\s/g, '');
        return building;
    }

    function getTaverns( tavernText ){
        var tavern = {
            title: tavernText[0],
            open: tavernText[1].match(/[0-9]{1,2}:[0-9]{2}\s(P|A)M/g)[0],
            close: tavernText[2].match(/[0-9]{1,2}:[0-9]{2}\s(P|A)M/g)[0],
            owners: getPeople(tavernText[2]),
            staff: getPeople(tavernText[6]),
            patrons: getPeople(tavernText[10]),
            menu: getTaverMenu(tavernText[3].match(/Menu.php\?.*?(NUM|type|id).*(=|[0-9])/g)[0])
        }
        return tavern;
    }

    function getTaverMenu( url ){
        var menuStringArray = dndToolsUtils.beautifyResponse(dndToolsUtils.makeRequest('http://www.mathemagician.net/DND/Town/' + url, {}, 'POST'));
        var menu = {
            Breakfast: [],
            Lunch: [],
            Dinner: [],
            Drinks: []
        };
        var menuType = "";
        for( var i = 0; i < menuStringArray.length; i ++ ){
            if( menuStringArray[i].indexOf('Breakfast') != -1 ){
                menuType = "Breakfast";
                continue;
            }
            if( menuStringArray[i].indexOf('Lunch') != -1 ){
                menuType = "Lunch";
                continue;
            }
            if( menuStringArray[i].indexOf('Dinner') != -1 ){
                menuType = "Dinner";
                continue;
            }
            if( menuStringArray[i].indexOf('Drinks') != -1 ){
                menuType = "Drinks";
                continue;
            }
            menu[menuType].push(menuStringArray[i].replaceAll('&nbsp;', ''));
        }
        return menu;
    }
}