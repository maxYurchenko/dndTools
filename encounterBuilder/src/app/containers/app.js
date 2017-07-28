import React, { Component } from 'react'
import axios from 'axios';
import Prepare from '../components/Prepare';
import Battle from '../components/Battle';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {


  constructor(){
    super();
    this.state = {
      selectedMonsters: []
    }
  }

  render() {   
    return (
      <Switch>
        <Route exact path='/' component={Prepare}/>
        <Route path='/battle' component={Battle}/>
      </Switch>
    );
  }
}

export default App;