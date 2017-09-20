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
      active: false,
      hideNames: false
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
      monsters: newProps.selectedMonsters,
      hideNames: newProps.hideNames
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
        <h2 className="fight-monsters-title">Battle!</h2>
        <table  className="fight-table">
          <thead>
            <th>Name</th>
            <th>Initiative</th>
            <th>Armour Class</th>
            <th>Hit Points</th>
            <th>Damage</th>
            <th>Notes</th>
          </thead>
            {this.state.monsters.map((monster,key) => {
              var current = false;
              if( this.state.currentFighter == key ){
                current = true; 
              }
              return (
                <tbody key={key}>
                  <Monster hideNames={this.state.hideNames} arrPosition={key} current={current} monster={monster} callbackParent={this.monsterChanged} />
                </tbody>
              )
            })}
        </table>
        <div className="fight-actions">
          <button className="button-primary" onClick={this.handleNext}>Next</button>
          <button className="button-primary"  onClick={this.editBattle}>Edit</button>
        </div>
      </div>
    );
  }
}

export default Battle;