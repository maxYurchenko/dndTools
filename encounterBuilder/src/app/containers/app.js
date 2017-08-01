import React, { Component } from 'react'
import Prepare from '../components/Prepare';
import Battle from '../components/Battle';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {


  constructor(){
    super();
    this.state = {
      selectedMonsters: [],
      prepare: true
    }
    this.startBattle = this.startBattle.bind(this);
    this.monstersModified = this.monstersModified.bind(this);
  }
  
  monstersModified( selectedMonsters ){
    this.setState({
      selectedMonsters: selectedMonsters
    });
  }

  startBattle(){
    this.setState({
      prepare: !this.state.prepare
    });
  }

  render() {
    return (
      <div>
        <Prepare active={this.state.prepare} callbackParent={this.monstersModified} startBattle={this.startBattle} />
        <Battle active={!this.state.prepare} selectedMonsters={this.state.selectedMonsters} />
      </div>
    );
  }
}

export default App;