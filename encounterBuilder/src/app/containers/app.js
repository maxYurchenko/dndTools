import React, { Component } from 'react'
import Prepare from '../components/Prepare';
import Battle from '../components/Battle';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {


  constructor(){
    super();
    this.state = {
      selectedMonsters: [],
      prepare: true,
      hideNames: true
    }
    this.startBattle = this.startBattle.bind(this);
    this.monstersModified = this.monstersModified.bind(this);
    this.showNameToggle = this.showNameToggle.bind(this);
  }
  
  monstersModified( selectedMonsters ){
    this.setState({
      selectedMonsters: selectedMonsters
    });
  }

  showNameToggle( checkbox ){
    this.setState({
      hideNames: checkbox
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
        <Prepare active={this.state.prepare} changeShowNames={this.showNameToggle} callbackParent={this.monstersModified} startBattle={this.startBattle} encounter={this.state.selectedMonsters} />
        <Battle hideNames={this.state.hideNames} active={!this.state.prepare} callbackParent={this.monstersModified} selectedMonsters={this.state.selectedMonsters} editBattle={this.startBattle} />
      </div>
    );
  }
}

export default App;