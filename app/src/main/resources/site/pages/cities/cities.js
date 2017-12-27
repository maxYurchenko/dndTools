var thymeleaf = require('/lib/xp/thymeleaf');

var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var norseUtils = require('norseUtils');
var cityLib = require('cityLib');
var dndToolsUtils = require('dndToolsUtils');
var helpers = require('helpers');

exports.get = handleGet;

function handleGet(req) {
    var me = this;
    var content = portal.getContent();

    function renderView() {
        var view = resolve('cities.html');
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
        var response = [];

        if( up.generateCity ){
            generateCity( up );
        }

        if( up.showGenerateForm ){
            var generateForm = thymeleaf.render( resolve('citiesGenerateForm.html'), {
                content: content,
            });
        }

        // TODO: create a function to fetch all available cities(refactoring)
        // Should look like:
        // var cities = functionName(params);
        var cities = contentLib.query({
            query: "_parentPath LIKE '/content" + content._path + "*'",
            start: 0,
            count: 10,
            contentTypes: [
                app.name + ":town"
            ],
        }).hits;

        for( var i = 0; i < cities.length; i++ ){
            cities[i] = cityLib.beautifyCity(cities[i], "max(1280)", 2);
        }
        // END TODO

        var model = {
            pageComponents: helpers.getPageComponents( req ),
            content: content,
            cities: cities,
            generateForm: generateForm,
            app: app
        };

        return model;


    }

    function generateCity( params ){
        params = generateParams(params);
        var population = generatePopulation( params.size );
        var wealth = generateWealth( population, params.size );
        var buildings = generateBuildings(population, params.size);
        var citizens = generateTownCitizens( population, params );
        return ;
    }

    function generatePopulation( size ){
        switch (size) {
            case 0:
                var population = Math.floor((Math.random() * 480) + 20);
                break;
            case 1:
                var population = Math.floor((Math.random() * 500) + 500);
                break;
            case 2:
                var population = Math.floor((Math.random() * 2000) + 1000);
                break;
            case 3:
                var population = Math.floor((Math.random() * 5000) + 3000);
                break;
            case 4:
                var population = Math.floor((Math.random() * 7000) + 5000);
                break;
            case 5:
                var population = Math.floor((Math.random() * 9000) + 7000);
                break;
            case 6:
                var population = Math.floor((Math.random() * 10000) + 10000);
                break;
            case 7:
                var population = Math.floor((Math.random() * 30000) + 20000);
                break;
            default:
                var population = Math.floor((Math.random() * 500) + 500);
                break;
            }
        return population;
    }

    function generateWealth( population, size ){
        return population * Math.floor((Math.random() * (100 * (size + 1))) + 10);
    }

    function generateBuildings( population, size ){
        var buildings = {};
        var score = {};
        var cityHelper = contentLib.get({ key: content.data.cityHelper }).data.townBuildingType;
        for( var i = 0; i < cityHelper.length; i++ ){
            if( (size - i + (Math.ceil(i/2))) > 0 ){
                var sizeCoefficient = size - i + Math.ceil(i/2);
            } else {
                var sizeCoefficient = 0;
            }
            score[cityHelper[i].type] = Math.floor((Math.random() * ((sizeCoefficient + 3) * 2)) + (sizeCoefficient * 50));
            buildings[cityHelper[i].type] = {};
            for( var j = 0; j < cityHelper[i].subTypes.length; j++ ){
                buildings[cityHelper[i].type][cityHelper[i].subTypes[j].subTypeName] = 0;
            }
        }

        for( var i = 0; i < cityHelper.length; i++ ){
            for( var j = 0; j < score[cityHelper[i].type] * 2; j++ ){
                var subTypeIndex = Math.floor(Math.random() * cityHelper[i].subTypes.length);
                if( parseInt(cityHelper[i].subTypes[subTypeIndex].subTypePossibility) <= score[cityHelper[i].type] ){
                    buildings[cityHelper[i].type][cityHelper[i].subTypes[subTypeIndex].subTypeName] += 1;
                    score[cityHelper[i].type] = score[cityHelper[i].type] - parseInt(cityHelper[i].subTypes[subTypeIndex].subTypePossibility);
                }
            }
        }
        return buildings;
    }

    function generateTownCitizens( population, params ){
        var currPopulation = population;
        var citizensPossibility = {
            human: params.human,
            elf: params.elf,
            dwarf: params.dwarf,
            halfelf: params.halfelf,
            gnome: params.gnome,
            halfling: params.halfling,
            halforc: params.halforc
        }
        var citizens = {
            human: 0,
            elf: 0,
            dwarf: 0,
            halfelf: 0,
            gnome: 0,
            halfling: 0,
            halforc: 0
        }
        while ( currPopulation > 0 ){
            for (var k in citizensPossibility){
                if (citizensPossibility.hasOwnProperty(k)) {
                    var tempPopulation = Math.floor(Math.random() * citizensPossibility[k]);
                    citizens[k] += tempPopulation;
                    currPopulation -= tempPopulation;
                }
            }
        }
        var citizensObjects = {};
        for (var k in citizens){
            if (citizens.hasOwnProperty(k)) {
                citizensObjects[k] = generateCitizensByRace(citizens[k], k);
            }
        }
        norseUtils.log(citizensObjects);
    }

    function getRace( params ){
        var currRace = Math.floor(Math.random() * 101);
    }

    function generateCitizensByRace( amount, race ){
        var namesLocations = portal.getSiteConfig().namesLocations;
        var result = [];
        var raceStats = selectNameArr( race );
        var names = contentLib.get({key: namesLocations[raceStats.names]});
        for( var i = 0; i < amount; i++ ){
            result.push(generateSingleCitizen( names, race, raceStats ));
        }
        return result;
    }

    function generateSingleCitizen( names, race, raceStats ){
        var sex = Math.floor(Math.random() * 2);
        var name = generateCitizenName(names);
        var age = Math.floor((Math.random() * raceStats.maxAge) + raceStats.minAge);
        return {
            //sex:
            //male - 0
            //female - 1
            name: name,
            sex: sex,
            age: age,
            race: race
        };
    }

    function selectNameArr( race, sex ){
        var names = '';
        var minAge = 0;
        var maxAge = 100;
        switch (race){
            case 'human':
                // human
                names = 'human';
                var minAge = 17;
                var maxAge = 100;
                break;
            case 'elf':
                // elf
                names = 'elves';
                var minAge = 100;
                var maxAge = 750;
                break;
            case 'dwarf':
                // dwarf
                names = 'dwarves';
                var minAge = 50;
                var maxAge = 350;
                break;
            case 'halforc':
                // orc
                names = 'orcs';
                var minAge = 14;
                var maxAge = 75;
                break;
            case 'halfling':
                // halfling
                names = 'human';
                var minAge = 20;
                var maxAge = 150;
                break;
            case 'gnome':
                // gnome
                names = 'human';
                var minAge = 40;
                var maxAge = 450;
                break;
            case 'halfelf':
                // half-elf
                names = 'elves';
                var minAge = 20;
                var maxAge = 180;
                break;
            case 7:
                // dragonborn
                names = 'other';
                var minAge = 15;
                var maxAge = 80;
                break;
            case 8:
                // aarakocra
                names = 'other';
                var minAge = 3;
                var maxAge = 30;
                break;
            case 9:
                // tiefling
                names = 'other';
                var minAge = 17;
                var maxAge = 120;
                break;
            case 10:
                // goliath
                names = 'other';
                var minAge = 17;
                var maxAge = 90;
                break;
            default:
                break;
        }
        if( names == 'other' ){
            return names;
        }
        switch (sex){
            case 0:
                names += 'Male';
                break;
            default:
                names += 'Female';
                break;
        }
        return {
            names: names,
            minAge: minAge,
            maxAge: maxAge,
        };
    }

    function generateCitizenName( nameArr ){
        var namesArrId = ['first', 'second', 'third', 'fourth'];
        var firstName = '';
        var lastName = '';
        for( var i = 0; i < namesArrId.length; i++ ){
            var canBreak = true;
            if( nameArr.data && nameArr.data.firstName && nameArr.data && nameArr.data.firstName && nameArr.data.firstName[namesArrId[i]] ){
                firstName += nameArr.data.firstName.first[Math.floor(Math.random() * nameArr.data.firstName.first.length)];
                canBreak = false;
            }
            if( nameArr.data && nameArr.data.lastName && nameArr.data && nameArr.data.lastName && nameArr.data.lastName[namesArrId[i]] ){
                lastName += nameArr.data.lastName[namesArrId[i]][Math.floor(Math.random() * nameArr.data.lastName[namesArrId[i]].length)];
                canBreak = false;
            }
            if( canBreak ){
                break;
            }
        }
        return (firstName + ' ' + lastName).trim();
    }

    function generateParams( params ){
        params = checkParams(params);
        if( ((params.human + params.halfelf + params.halfling + params.halforc + params.dwarf + params.gnome + params.elf) == 100) ) {
            var cityParams = {
                name: params.name,
                size: params.size,
                dwarf: params.dwarf,
                elf: params.elf,
                gnome: params.gnome,
                halfelf: params.halfelf,
                halfling: params.halfling,
                halforc: params.halforc,
                human: params.human,
                children: params.children,
                mountains: params.mountains,
                military: params.military,
                port: params.port,
                agricultural: params.agricultural,
                forest: params.forest
            };
        } else {
            var cityParams = {
                name: params.name,
                size: params.size,
                dwarf: 8,
                elf: 7,
                gnome: 5,
                halfelf: 5,
                halfling: 10,
                halforc: 5,
                human: 60,
                children: ''
            };
        }
        return cityParams;
    }

    function checkParams( params ){
        if(isNaN( parseInt(params.human))){
            params.human = 0;
        } else {
            params.human = parseInt(params.human);
        }
        if(isNaN( parseInt(params.halfelf))){
            params.halfelf = 0;
        } else {
            params.halfelf = parseInt(params.halfelf);
        }
        if(isNaN( parseInt(params.halforc))){
            params.halforc = 0;
        } else {
            params.halforc = parseInt(params.halforc);
        }
        if(isNaN( parseInt(params.halfling))){
            params.halfling = 0;
        } else {
            params.halfling = parseInt(params.halfling);
        }
        if(isNaN( parseInt(params.dwarf))){
            params.dwarf = 0;
        } else {
            params.dwarf = parseInt(params.dwarf);
        }
        if(isNaN( parseInt(params.gnome))){
            params.gnome = 0;
        } else {
            params.gnome = parseInt(params.gnome);
        }
        if(isNaN( parseInt(params.elf))){
            params.elf = 0;
        } else {
            params.elf = parseInt(params.elf);
        }
        if(isNaN( parseInt(params.size))){
            params.size = 0;
        } else {
            params.size = parseInt(params.size);
        }
        return params;
    }

    return renderView();
}