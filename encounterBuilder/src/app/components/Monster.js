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
	      	hpInputValue: '',
	      	note: '',
	      	current: false
	    }
	    this.changeHP = this.changeHP.bind(this);
	    this.updateHPInputValue = this.updateHPInputValue.bind(this);
	    this.changeNote = this.changeNote.bind(this);
  	}

	componentDidMount() {
		this.setState({ 
			monster: this.props.monster,
	      	hpValue: parseInt(this.props.monster.data.hp),
	      	current: this.props.current
		});
	}

	/*componentWillReceiveProps(newProps) {
		this.setState({ 
			monster: newProps.monster,
	      	hpValue: parseInt(newProps.monster.data.hp),
	      	current: newProps.current
		});
	}*/

  	changeHP( e ){
  		let temp = this.state.monster;
  		if( e.target.value.match(/[\+-]?[0-9]+/g) && e.target.value.match(/[\+-]?[0-9]+/g)[0] ){
  			temp.data.hp = this.state.hpValue + parseInt(e.target.value);
	    	this.setState({
	    		hpValue: this.state.hpValue + parseInt(e.target.value),
	    		hpInputValue: '',
	    		monster: temp
	    	}, () => {
	    		this.props.callbackParent(this.state.monster, this.props.arrPosition);
	    	});
	    }
  	}

  	updateHPInputValue( e ){
  		this.setState({
  			hpInputValue: e.target.value
  		});
  	}

  	changeNote( e ){
  		this.setState({
  			note: e.target.value
  		});
  	}

  	render() {  
  		var style = {};
  		if( this.state.current ){
  			style = {
  				background: 'red'
  			};
  		}
	    return (
	      	<div style={style}>
	          	<span>Name: {this.state.monster.displayName}</span>
	          	<span> Init: {this.state.monster.data.initiative}</span>
	          	<span> AC: {this.state.monster.data.ac}</span>
	          	<span> HP: {this.state.hpValue}</span>
	          	<input value={this.state.hpInputValue} type="text" onChange={this.updateHPInputValue} onBlur={this.changeHP}/>
	          	<input value={this.state.note} type="text" onChange={this.changeNote}/>
	      	</div>
	    );
  	}
}

export default Monster;