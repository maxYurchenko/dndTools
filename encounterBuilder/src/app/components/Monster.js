import React, { Component } from 'react'
import axios from 'axios';
import { Switch, Route } from 'react-router-dom';

class Monster extends React.Component {


  	constructor(){
	    super();
	    this.state = {
	      	monster: {
	      		data: {}
	      	},
	      	hpValue: 0,
	      	hpInputValue: ''
	    }
	    this.changeHP = this.changeHP.bind(this);
	    this.updateHPInputValue = this.updateHPInputValue.bind(this);
  	}

	componentDidMount() {
		this.setState({ 
			monster: this.props.monster,
	      	hpValue: parseInt(this.props.monster.data.hp)
		});
	}

	componentWillReceiveProps(newProps) {
		this.setState({ 
			monster: newProps.monster,
	      	hpValue: parseInt(newProps.monster.data.hp)
		});
	}

  	changeHP( e ){
  		if( e.target.value.match(/[\+-]?[0-9]+/g) && e.target.value.match(/[\+-]?[0-9]+/g)[0] ){
	    	this.setState({
	    		hpValue: this.state.hpValue + parseInt(e.target.value),
	    		hpInputValue: ''
	    	});
	    }
  	}

  	updateHPInputValue( e ){
  		this.setState({
  			hpInputValue: e.target.value
  		});
  	}

  	render() {   
	    return (
	      	<div>
	          	<span>Name: {this.state.monster.displayName}</span>
	          	<span> Init: {this.state.monster.data.initiative}</span>
	          	<span> AC: {this.state.monster.data.ac}</span>
	          	<span> HP: {this.state.hpValue}</span>
	          	<input value={this.state.hpInputValue} type="text" onBlur={this.changeHP} onChange={this.updateHPInputValue}/>
	      	</div>
	    );
  	}
}

export default Monster;