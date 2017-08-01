import React, { Component } from 'react'
import axios from 'axios';
import EnemyTable from '../components/EnemyTable';
import EncounterMonsters from '../components/EncounterMonsters';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Prepare extends React.Component {


  constructor(){
    super();
    this.state = {
      monsters: monsters,
      selectedMonsters: [],
      active: true
    }
    this.monstersModified = this.monstersModified.bind(this);
    this.prepareBattle = this.prepareBattle.bind(this);
    this.startBattle = this.startBattle.bind(this);
  }
  
  monstersModified( selectedMonsters ){
  	this.prepareBattle();
    this.setState({
      selectedMonsters: selectedMonsters
    }, () =>{
      this.props.callbackParent(this.state.selectedMonsters);
    });
  }

  componentWillReceiveProps( newProps ){
    this.setState({
      active: newProps.active
    });
  }

  prepareBattle(){
    for( let m of this.state.selectedMonsters ){
      m.data.initiative = (Math.floor((parseInt(m.data.dex) - 10) / 2 )) + Math.floor(Math.random() * 20) + 1;
    }
    var monsters = this.state.selectedMonsters;
    var swapped;
    do {
      swapped = false;
      for (var i=0; i < monsters.length-1; i++) {
        if (monsters[i].data.initiative < monsters[i+1].data.initiative) {
          var temp = monsters[i];
          monsters[i] = monsters[i+1];
          monsters[i+1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
    this.setState({
      selectedMonsters: monsters
    });
  }

  startBattle(){
    this.props.startBattle();
  }

  render() {  
    if( !this.state.active ){
      return null;
    } 
    return (
      <div>
        <div>
          <EncounterMonsters enemies={this.state.monsters} selectedMonsters={this.state.selectedMonsters} />
        </div>
        <div>
          <EnemyTable enemies={this.state.monsters} callbackParent={this.monstersModified} />
        </div>
        <button onClick={this.startBattle}>Battle!</button>
      </div>
    );
  }
}

export default Prepare;

const monsters = [{
  "_id": "4771d50b-d945-42bc-acdf-08a4e6115255",
  "_name": "Awakened Shrub",
  "_path": "/test/monsters/Awakened Shrub",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:05.847Z",
  "modifiedTime": "2017-07-12T08:30:05.847Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Awakened Shrub",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Small plant",
    "alignment": "unaligned",
    "ac": "9",
    "armor": "",
    "hp": "10",
    "hpDice": "3d6",
    "speed": "20 ft.",
    "str": "3",
    "dex": "8",
    "con": "11",
    "int": "10",
    "wis": "10",
    "cha": "6",
    "exp": "10",
    "cr": "0",
    "languages": "one language known by its creator",
    "senses": "passive Perception 10",
    "skills": "",
    "additionalStats": ["Damage Vulnerabilities fire", "Damage Resistances piercing", "False Appearance. While the shrub remains motionless, it is indistinguishable from a normal shrub."],
    "actions": ["Rake. Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 âˆ’ 1) slashing damage.", "An awakened shrub is an ordinary shrub given sentience and mobility by the awaken spell or similar magic."]
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "4c31a4d9-82ec-41eb-9530-dd542be47f0a",
  "_name": "Crawling Claw",
  "_path": "/test/monsters/Crawling Claw",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.403Z",
  "modifiedTime": "2017-07-12T08:30:06.403Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Crawling Claw",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny undead",
    "alignment": "neutral evil",
    "ac": "12",
    "armor": "",
    "hp": "2",
    "hpDice": "1d4",
    "speed": "20 ft., climb 20 ft.",
    "str": "13",
    "dex": "14",
    "con": "11",
    "int": "5",
    "wis": "10",
    "cha": "4",
    "exp": "10",
    "cr": "0",
    "languages": "understands Common but canâ€™t speak",
    "senses": "blindsight 30 ft. (blind beyond this radius), passive Perception 10",
    "skills": "",
    "additionalStats": ["Damage Immunities poison", "Condition Immunities charmed, exhaustion, poisoned", "Turn Immunity. The claw is immune to effects that turn undead."],
    "actions": "Claw. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) bludgeoning or slashing damage (clawâ€™s choice)."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "f81efc21-497b-42d8-b9bc-7c55ff264999",
  "_name": "Baboon",
  "_path": "/test/monsters/Baboon",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:05.910Z",
  "modifiedTime": "2017-07-12T08:30:05.910Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Baboon",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Small beast",
    "alignment": "unaligned",
    "ac": "12",
    "armor": "",
    "hp": "3",
    "hpDice": "1d6",
    "speed": "30 ft., climb 30 ft.",
    "str": "8",
    "dex": "14",
    "con": "11",
    "int": "4",
    "wis": "12",
    "cha": "6",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "passive Perception 11",
    "skills": "",
    "additionalStats": "Pack Tactics. The baboon has advantage on an attack roll against a creature if at least one of the baboonâ€™s allies is within 5 feet of the creature and the ally isnâ€™t incapacitated.",
    "actions": "Bite. Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 âˆ’ 1) piercing damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "a93db1ee-e79a-4f9c-b040-ee1194557c45",
  "_name": "Crab",
  "_path": "/test/monsters/Crab",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.231Z",
  "modifiedTime": "2017-07-12T08:30:06.231Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Crab",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny beast",
    "alignment": "unaligned",
    "ac": "11",
    "armor": "natural armor",
    "hp": "2",
    "hpDice": "1d4",
    "speed": "20 ft., swim 20 ft.",
    "str": "2",
    "dex": "11",
    "con": "10",
    "int": "1",
    "wis": "8",
    "cha": "2",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "blindsight 30 ft., passive Perception 9",
    "skills": "Stealth +2",
    "additionalStats": "Amphibious. The crab can breathe air and water.",
    "actions": "Claw. Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "306aa7cf-c4ac-461a-a7e7-abbd1d3b351d",
  "_name": "Bat",
  "_path": "/test/monsters/Bat",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.032Z",
  "modifiedTime": "2017-07-12T08:30:06.032Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Bat",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny beast",
    "alignment": "unaligned",
    "ac": "12",
    "armor": "",
    "hp": "1",
    "hpDice": "1d4",
    "speed": "5 ft., fly 30 ft.",
    "str": "2",
    "dex": "15",
    "con": "8",
    "int": "2",
    "wis": "12",
    "cha": "4",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "blindsight 60 ft., passive Perception 11",
    "skills": "",
    "additionalStats": ["Echolocation. The bat canâ€™t use its blindsight while deafened.", "Keen Hearing. The bat has advantage on Wisdom (Perception) checks that rely on hearing."],
    "actions": "Bite. Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "2222208e-1573-4673-ab3e-a1e1fc3bff12",
  "_name": "Cat",
  "_path": "/test/monsters/Cat",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.090Z",
  "modifiedTime": "2017-07-12T08:30:06.090Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Cat",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny beast",
    "alignment": "unaligned",
    "ac": "12",
    "armor": "",
    "hp": "2",
    "hpDice": "1d4",
    "speed": "40 ft., climb 30 ft.",
    "str": "3",
    "dex": "15",
    "con": "10",
    "int": "3",
    "wis": "12",
    "cha": "7",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "passive Perception 13",
    "skills": "Perception +3, Stealth +4",
    "additionalStats": "Keen Smell. The cat has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "Claws. Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "f9b9f814-3dae-43bb-8e39-fc0bb02d2e43",
  "_name": "Commoner",
  "_path": "/test/monsters/Commoner",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.173Z",
  "modifiedTime": "2017-07-12T08:30:06.173Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Commoner",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Medium humanoid (any race)",
    "alignment": "any alignment",
    "ac": "10",
    "armor": "",
    "hp": "4",
    "hpDice": "1d8",
    "speed": "30 ft.",
    "str": "10",
    "dex": "10",
    "con": "10",
    "int": "10",
    "wis": "10",
    "cha": "10",
    "exp": "10",
    "cr": "0",
    "languages": "any one language (usually Common)",
    "senses": "passive Perception 10",
    "skills": "",
    "actions": ["Club. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage.", "Commoners include peasants, serfs, slaves, servants, pilgrims, merchants, artisans, and hermits."]
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "4a93d597-bd9d-4c2a-a3bd-1acfdb02eb82",
  "_name": "Badger",
  "_path": "/test/monsters/Badger",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:05.966Z",
  "modifiedTime": "2017-07-12T08:30:05.966Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Badger",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny beast",
    "alignment": "unaligned",
    "ac": "10",
    "armor": "",
    "hp": "3",
    "hpDice": "1d4",
    "speed": "20 ft., burrow 5 ft.",
    "str": "4",
    "dex": "11",
    "con": "12",
    "int": "2",
    "wis": "12",
    "cha": "5",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "darkvision 30 ft., passive Perception 11",
    "skills": "",
    "additionalStats": "Keen Smell. The badger has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "Bite. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "2bb164b0-1493-40b7-96a0-1534df9b1220",
  "_name": "Deer",
  "_path": "/test/monsters/Deer",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.461Z",
  "modifiedTime": "2017-07-12T08:30:06.461Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Deer",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Medium beast",
    "alignment": "unaligned",
    "ac": "13",
    "armor": "",
    "hp": "4",
    "hpDice": "1d8",
    "speed": "50 ft.",
    "str": "11",
    "dex": "16",
    "con": "11",
    "int": "2",
    "wis": "14",
    "cha": "5",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "passive Perception 12",
    "skills": "",
    "actions": "Bite. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "0e08d0da-efd9-4db6-b361-9eb2a2305389",
  "_name": "Homunculus",
  "_path": "/test/monsters/Homunculus",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.950Z",
  "modifiedTime": "2017-07-12T08:30:06.950Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Homunculus",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Tiny construct",
    "alignment": "neutral",
    "ac": "13",
    "armor": "natural armor",
    "hp": "5",
    "hpDice": "2d4",
    "speed": "20 ft., fly 40 ft.",
    "str": "4",
    "dex": "15",
    "con": "11",
    "int": "10",
    "wis": "10",
    "cha": "7",
    "exp": "10",
    "cr": "0",
    "languages": "understands the languages of its creator but canâ€™t speak",
    "senses": "darkvision 60 ft., passive Perception 10",
    "skills": "",
    "additionalStats": ["Damage Immunities poison", "Condition Immunities charmed, poisoned", "Telepathic Bond. While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically."],
    "actions": "Bite. Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or be poisoned for 1 minute. If the saving throw fails by 5 or more, the target is instead poisoned for 5 (1d10) minutes and unconscious while poisoned in this way."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "e0b5a082-9d0a-4018-8893-8a3f3427f45d",
  "_name": "Giant Fire Beetle",
  "_path": "/test/monsters/Giant Fire Beetle",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:06.759Z",
  "modifiedTime": "2017-07-12T08:30:06.759Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Giant Fire Beetle",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Small beast",
    "alignment": "unaligned",
    "ac": "13",
    "armor": "natural armor",
    "hp": "4",
    "hpDice": "1d6",
    "speed": "30 ft.",
    "str": "8",
    "dex": "10",
    "con": "12",
    "int": "1",
    "wis": "7",
    "cha": "3",
    "exp": "10",
    "cr": "0",
    "languages": "â€”",
    "senses": "blindsight 30 ft., passive Perception 8",
    "skills": "",
    "additionalStats": "Illumination. The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
    "actions": ["Bite. Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 2 (1d6 âˆ’ 1) slashing damage.", "A giant fire beetle is a nocturnal creature that takes its name from a pair of glowing glands that give off light. Miners and adventurers prize these creatures, for a giant fire beetleâ€™s glands continue to shed light for 1d6 days after the beetle dies. Giant fire beetles are most commonly found underground and in dark forests."]
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}, {
  "_id": "828ac317-1059-445c-99f1-b082c221b9d3",
  "_name": "Lemure",
  "_path": "/test/monsters/Lemure",
  "creator": "user:system:su",
  "modifier": "user:system:su",
  "createdTime": "2017-07-12T08:30:07.151Z",
  "modifiedTime": "2017-07-12T08:30:07.151Z",
  "owner": "user:system:su",
  "type": "com.norsedigital.testing:creature",
  "displayName": "Lemure",
  "hasChildren": false,
  "valid": true,
  "data": {
    "size": "Medium fiend (devil)",
    "alignment": "lawful evil",
    "ac": "7",
    "armor": "",
    "hp": "13",
    "hpDice": "3d8",
    "speed": "15 ft.",
    "str": "10",
    "dex": "5",
    "con": "11",
    "int": "1",
    "wis": "11",
    "cha": "3",
    "exp": "10",
    "cr": "0",
    "languages": "understands Infernal but canâ€™t speak",
    "senses": "darkvision 120 ft., passive Perception 10",
    "skills": "",
    "additionalStats": ["Damage Resistances cold", "Damage Immunities fire, poison", "Condition Immunities charmed, frightened, poisoned", "Devilâ€™s Sight. Magical darkness doesnâ€™t impede the lemureâ€™s darkvision.", "Hellish Rejuvenation. A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water."],
    "actions": "Fist. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
  },
  "x": {},
  "page": {},
  "attachments": {},
  "publish": {}
}];