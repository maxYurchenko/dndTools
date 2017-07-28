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
    }
    this.changeHP = this.changeHP.bind(this);
  }

  componentDidMount(){
    this.setState({
      monsters: this.props.location.state.monsters
    }, ()=>{
    });
  }
  changeHP( e ){
    var temp = this.state.monsters;
  }

  render() {   
    return (
      <div>
        Battle!
        {this.state.monsters.map((monster,key) => {
          return (
            <div key={key}>
              <Monster monster={monster} />
            </div>
          )
        })}
        <button onClick={this.handleNext}>Next</button>
      </div>
    );
  }
}

export default Battle;