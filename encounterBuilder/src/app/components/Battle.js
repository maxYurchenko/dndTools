import React, { Component } from 'react'
import axios from 'axios';
import { Switch, Route } from 'react-router-dom';
import Monster from '../components/Monster';

class Battle extends React.Component {


  constructor(){
    super();
    this.state = {
      monsters: [],
      hpValue: [],
      currentFighter: 0,
      active: false
    }
    this.handleNext = this.handleNext.bind(this);
    this.editBattle = this.editBattle.bind(this);
    this.monsterChanged = this.monsterChanged.bind(this);
  }
  handleNext( e ){
    if( this.state.currentFighter >= this.state.monsters.length - 1 ){
      this.setState({
        currentFighter: 0
      });
    } else {
      this.setState({
        currentFighter: this.state.currentFighter + 1
      });
    }
  }

  componentWillReceiveProps( newProps ){
    let temp = newProps.selectedMonsters;
    for( let i = 0; i < temp.length; i++ ){
      if( !temp[i].data.initiative || temp[i].data.initiative == '' ){
        temp.splice(i, 1);
      }
    }
    this.setState({
      active: newProps.active,
      monsters: newProps.selectedMonsters
    });
  }

  editBattle(){
    this.props.editBattle();
  }

  monsterChanged( monster, key ){
    let temp = this.state.monsters;
    temp[key] = monster;
    this.setState({
      monsters: temp
    }, () => {
      this.props.callbackParent(this.state.monsters);
    });
  }

  render() {  
    if( !this.state.active ){
      return null;
    } 
    return (
      <div>
        Battle!
        {this.state.monsters.map((monster,key) => {
          var current = false;
          if( this.state.currentFighter == key ){
            current = true; 
          }
          return (
            <div key={key}>
              <Monster arrPosition={key} current={current} monster={monster} callbackParent={this.monsterChanged} />
            </div>
          )
        })}
        <button onClick={this.handleNext}>Next</button>
        <button onClick={this.editBattle}>Edit</button>
      </div>
    );
  }
}

export default Battle;