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
      currentFighter: 0
    }
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount(){
    this.setState({
      monsters: this.props.location.state.monsters
    }, ()=>{
    });
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

  render() {   
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
              <Monster current={current} monster={monster} />
            </div>
          )
        })}
        <button onClick={this.handleNext}>Next</button>
      </div>
    );
  }
}

export default Battle;