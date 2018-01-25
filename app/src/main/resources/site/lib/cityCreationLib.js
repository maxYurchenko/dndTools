var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var i18n = require('/lib/xp/i18n');
var httpClientLib = require('/lib/xp/http-client');
var norseUtils = require('norseUtils');
var content = null;

exports.createCity = function( params, currContent ){
  norseUtils.log('Preparing to generate city');
  content = currContent;
  params = generateParams(params);
  var population = generatePopulation( params.size );
  var wealth = generateWealth( population, params.size );
  var citizens = generateTownCitizens( population, params );
  var buildings = generateBuildingsAmount(population, params.size);
  citizens = generateRelationship(citizens);

  norseUtils.log('Total citizens: ' + citizens.length);
  norseUtils.log('Creating citizens objects');
  var paths = createCity(params.name, population, wealth, params.size);
  for( var i = 0; i < citizens.length; i++ ){
    this.createPerson(citizens[i], paths.citizensPath);
  }
  norseUtils.log('Creating buildings objects');
  for (var b in buildings) {
    if (buildings.hasOwnProperty(b)) {
      for (var subType in buildings[b]) {
        if (buildings[b].hasOwnProperty(subType)) {
          for( var i = 0; i < buildings[b][subType].length; i++ ){
            buildings[b][subType][i].employees = generateBuildingWorkers( citizens, buildings[b][subType][i].workers );
            this.createBuilding(buildings[b][subType][i], subType, b, paths.buildingsPath);
          }
        }
      }
    }
  }
  norseUtils.log('Creating relationship between citizens');
  for( var i = 0; i < citizens.length; i++ ){
    this.addRelationshipToPerson(citizens[i]);
  }
  norseUtils.log('Finished');

}

function generateBuildingWorkers( citizens, amount ){
  var result = [];
  for( var i = 0; i < amount; ){
    var citizenIndex = Math.floor((Math.random() * citizens.length));
    if( citizens[citizenIndex] && !citizens[citizenIndex].employed ){
      citizens[citizenIndex].employed = true;
      result.push(citizens[citizenIndex].name);
      i++;
    }
  }
  return result;
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

function generateBuildingsAmount( population, size ){
  var buildingsAmount = {};
  var score = {};
  var cityHelper = contentLib.get({ key: content.data.cityHelper }).data.townBuildingType;
  for( var i = 0; i < cityHelper.length; i++ ){
      if( (size - i + (Math.ceil(i/2))) > 0 ){
          var sizeCoefficient = size - i + Math.ceil(i/2);
      } else {
          var sizeCoefficient = 0;
      }
      score[cityHelper[i].type] = Math.floor((Math.random() * ((sizeCoefficient + 3) * 2)) + (sizeCoefficient * 50));
      buildingsAmount[cityHelper[i].type] = {};
      for( var j = 0; j < cityHelper[i].subTypes.length; j++ ){
          buildingsAmount[cityHelper[i].type][cityHelper[i].subTypes[j].subTypeName] = {
              amount: 0
          };
      }
  }

  for( var i = 0; i < cityHelper.length; i++ ){
      for( var j = 0; j < score[cityHelper[i].type] * 2; j++ ){
          var subTypeIndex = Math.floor(Math.random() * cityHelper[i].subTypes.length);
          if( parseInt(cityHelper[i].subTypes[subTypeIndex].subTypePossibility) <= score[cityHelper[i].type] ){
              buildingsAmount[cityHelper[i].type][cityHelper[i].subTypes[subTypeIndex].subTypeName].amount += 1;
              buildingsAmount[cityHelper[i].type][cityHelper[i].subTypes[subTypeIndex].subTypeName].minWorkers = parseInt(cityHelper[i].subTypes[subTypeIndex].minEmployees);
              buildingsAmount[cityHelper[i].type][cityHelper[i].subTypes[subTypeIndex].subTypeName].maxWorkers = parseInt(cityHelper[i].subTypes[subTypeIndex].maxEmployees);
              score[cityHelper[i].type] = score[cityHelper[i].type] - parseInt(cityHelper[i].subTypes[subTypeIndex].subTypePossibility);
          }
      }
  }
  return prepareBuildingsForGeneration( buildingsAmount );
}

function prepareBuildingsForGeneration( buildingsAmount ){
  var buildingsObject = {};
  for (var k in buildingsAmount){
      if (buildingsAmount.hasOwnProperty(k)) {
          for (var m in buildingsAmount[k]){
              if (buildingsAmount[k].hasOwnProperty(m)) {
                  if( !buildingsObject[k] ){
                      buildingsObject[k] = {};
                  }
                  if( !buildingsObject[k][m] ){
                      buildingsObject[k][m] = {};
                  }
                  buildingsObject[k][m] = generateBuildingsByType(buildingsAmount[k][m], m);
              }
          }
      }
  }
  return buildingsObject;
}

function generateBuildingsByType( amount, type ){
  var namesLocations = portal.getSiteConfig().namesLocations;
  var result = [];
  var typeName = selectBuildingType( type );
  var names = contentLib.get({key: namesLocations[typeName]});
  for( var i = 0; i < amount.amount; i++ ){
      result.push(generateSingleBuilding( names, type, amount.minWorkers, amount.maxWorkers ));
  }
  return result;
}

function generateSingleBuilding( names, type, minWorkers, maxWorkers ){
  var name = generateName(names);
  var workers = Math.floor((Math.random() * (maxWorkers - minWorkers)) + minWorkers);
  var availablePositions = Math.floor(Math.random() * ((maxWorkers) - minWorkers - workers)) - minWorkers;
  availablePositions = availablePositions < 0 ? 0 : availablePositions;
  availablePositions = availablePositions > 10 ? 10 : availablePositions;
  var lunchTime = 12 + Math.floor((Math.random() * 12) + 1) - Math.floor((Math.random() * 12) + 1);
  var lunchOpen = Math.floor((Math.random() * 2)) - Math.floor((Math.random() * 2));
  return {
      name: name,
      availablePositions: availablePositions,
      workers: workers,
      lunchTime: lunchTime,
      lunchOpen: lunchOpen ? lunchOpen : 0,
      prices : Math.floor(Math.random() * 100 + 85)
  };
}

function selectBuildingType( type ){
  switch (type){
      case 'blacksmith':
          return 'blacksmith';
      case 'armorer':
          return 'blacksmith';
      case 'weaponsmith':
          return 'blacksmith';
      case 'specialtySmith':
          return 'blacksmith';
      case 'inn':
          return 'tavern';
      case 'hostel':
          return 'tavern';
      case 'tavern':
          return 'tavern';
      default:
          return 'shop';
  }
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
  var citizensObjects = [];
  for (var k in citizens){
      if (citizens.hasOwnProperty(k)) {
          citizensObjects.push.apply(citizensObjects, generateCitizensByRace(citizens[k], k));
      }
  }
  return citizensObjects;
}

function getRace( params ){
  var currRace = Math.floor(Math.random() * 101);
}

function generateCitizensByRace( amount, race ){
  var namesLocations = portal.getSiteConfig().namesLocations;
  var result = [];
  var raceStats = selectNameArr( race );
  var names = contentLib.get({key: namesLocations[raceStats.names]});
  var counter = {
      guards: 0,
      commoners: 0,
      advernturers: 0
  };
  for( var i = 0; i < amount; i++ ){
      /*

      ****************************

      COUNTING OBJECTS OF CITIZENS
          FOR INTERNAL TESTING

      ****************************

      var temp = generateSingleCitizen( names, race, raceStats );
      if( temp.occupation == 'commoner'){
          counter.commoners ++;
      }
      if( temp.occupation == 'guard'){
          counter.guards ++;
      }
      if( temp.occupation == 'adventurer'){
          counter.advernturers ++;
      }
      result.push(temp);

      ***************************

      */
      result.push(generateSingleCitizen( names, race, raceStats ));
  }
  return result;
}

function generateSingleCitizen( names, race, raceStats ){
  var sex = Math.floor(Math.random() * 2);
  var name = generateName(names);
  var age = Math.floor((Math.random() * raceStats.maxAge) + raceStats.minAge);
  var level = Math.abs(Math.floor((Math.random() * 20)) - Math.floor((Math.random() * 20)) + 1);
  var occupations = ['commoner', 'guard', 'guard', 'adventurer'];
  var classes = ['fighter', 'rogue', 'paladin', 'cleric', 'monk', 'ranger', 'barbarian', 'wizard', 'warlock', 'bard', 'sorcerer', 'druid'];
  var occupationCoef = Math.floor((Math.random() * 4)) - Math.floor((Math.random() * 50));
  occupationCoef = occupationCoef < 0 ? 0 : occupationCoef;
  if( occupationCoef > 0 ){
      var charachterClassCoef = Math.floor((Math.random() * 12)) - Math.floor((Math.random() * 12));
      while( charachterClassCoef < 0 ){
          charachterClassCoef = Math.floor((Math.random() * 12)) - Math.floor((Math.random() * 12));
      }
      var charachterClass = classes[charachterClassCoef];
  } else {
      charachterClass = '';
  }
  var friends = Math.floor((Math.random() * 25));
  var married = Math.floor((Math.random() * friends)) - Math.floor((Math.random() * friends));
  return {
      //sex:
      //male - 0
      //female - 1
      name: name,
      friends: friends,
      married: married > 0 ? true : false,
      sex: sex,
      age: age,
      race: race,
      friendsArray: [],
      level: level,
      occupation: occupations[occupationCoef],
      class: charachterClass
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

function generateName( nameArr ){
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

function createCity( name, population, wealth, size ){
  var city = contentLib.create({
      name: name,
      displayName: name,
      parentPath: '/dndTools/cities',
      contentType: app.name + ':town',
      data: {
          wealth: wealth,
          size: size,
          population: population
      }
  });
  var citizensFolder = contentLib.create({
      name: 'citizens',
      displayName: 'Citizens',
      parentPath: city._path,
      contentType: 'base:folder',
      data: {}
  });
  var buildingsFolder = contentLib.create({
      name: 'buildings',
      displayName: 'Buildings',
      parentPath: city._path,
      contentType: 'base:folder',
      data: {}
  });
  return {
    buildingsPath: buildingsFolder._path,
    citizensPath: citizensFolder._path
  };
}

function generateRelationship( citizens ){
  for( var i = 0; i < citizens.length; i++){
    if( citizens[i].married && !citizens[i].spouse ){
      var marriedFound = false;
      while (!marriedFound) {
        var j = Math.floor((Math.random() * citizens.length));
        if( (j != i) && (citizens[j].married) && (citizens[j].sex != citizens[i].sex) ){
          citizens[i].spouse = citizens[j].name;
          citizens[j].spouse = citizens[i].name;
          marriedFound = true;
        }
      }
    }
    for( var m = 0; m < citizens[i].friends; m++ ){
      var k = Math.floor((Math.random() * citizens.length));
      if((k != i) && citizens[i].friendsArray.indexOf(citizens[k].name) == -1){
        citizens[i].friendsArray.push(citizens[k].name);
        citizens[k].friendsArray.push(citizens[i].name);
      }
    }
  }
  return citizens;
}

function createRelationshipArray( person ){
  var result = [];
  if( person.spouse ){
    var spouse = contentLib.query({
      start: 0,
      count: 1,
      query: "displayName = '" + person.spouse + "'",
      branch: "draft",
      contentTypes: [
          app.name + ":person"
      ]
    }).hits[0];
    result.push({type: 'spouse', person: spouse._id});
  }
  for( var i = 0; i < person.friendsArray.length; i++ ){
    var friend = contentLib.query({
      start: 0,
      count: 1,
      query: "displayName = '" + person.friendsArray[i] + "'",
      branch: "draft",
      contentTypes: [
          app.name + ":person"
      ]
    }).hits[0];
    result.push({type: 'friend', person: friend._id});
  }
  return result;
}

exports.addRelationshipToPerson = function( person ){
  try{
    var relationshipArray = createRelationshipArray(person);
    var key = contentLib.query({
      start: 0,
      count: 1,
      query: "displayName = '" + person.name + "'",
      branch: "draft",
      contentTypes: [
          app.name + ":person"
      ]
    }).hits[0]._path;
    var result = contentLib.modify({
      key: key,
      editor: relationshipEditor
    });
  } catch( err ){
    norseUtils.log('ERROR while adding relationship to ' + person.occupation + ' ' + person.name);
  }

  function relationshipEditor(c){
    c.data.relationships = relationshipArray;
    return c;
  }
}

exports.createPerson = function( person, parentPath ){
  try{
    contentLib.create({
          name: person.name,
          displayName: person.name,
          parentPath: parentPath,
          contentType: app.name + ':person',
          refresh: true,
          data: {
            race: person.race,
            sex: person.sex,
            age: person.age,
            class: person.class,
            occupation: person.occupation,
            level: person.level,
            married: person.married
          }
      });
  } catch( err ){
    norseUtils.log('ERROR creating ' + person.occupation + ' ' + person.name);
  }
}

exports.createBuilding = function( building, type, subType, parentPath ){
  try{
    var buidlingEmployees = [];
    for( var i = 0; i < building.employees.length; i++ ){
      var currEployeeId = contentLib.query({
        start: 0,
        count: 1,
        query: "displayName = '" + building.employees[i] + "'",
        branch: "draft",
        contentTypes: [
            app.name + ":person"
        ]
      }).hits[0];
      if( i < 1 ){
        buidlingEmployees.push({ id: currEployeeId._id, role: "owner"});
      } else {
        buidlingEmployees.push({ id: currEployeeId._id, role: "worker"});
      }
    }
    contentLib.create({
          name: building.name,
          displayName: building.name,
          parentPath: parentPath,
          contentType: app.name + ':building',
          refresh: true,
          data: {
            type: type,
            subType: subType,
            availablePositions: building.availablePositions,
            workers: building.workers,
            price: building.prices,
            staff: buidlingEmployees,
            lunchTime: building.lunchTime,
            lunchOpen: building.lunchOpen
          }
      });
  } catch( err ){
    norseUtils.log('ERROR creating ' + subType + ' ' + type + ' ' + building.name);
  }
}