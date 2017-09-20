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
  		var currenTurn = "";
  		if( this.state.current ){ 
  			currenTurn = "curren-turn";
  		}
	    return (
	      	<tr className={currenTurn}>
	          	<td>{this.state.monster.displayName}</td>
	          	<td>{this.state.monster.data.initiative}</td>
	          	<td>{this.state.monster.data.ac}</td>
	          	<td>{this.state.hpValue}</td>
				<td>
	          		<input value={this.state.hpInputValue} type="text" laceholder="Enter damage" onChange={this.updateHPInputValue} onBlur={this.changeHP}/>
				</td>
				<td>
	          		<textarea value={this.state.note} laceholder="Enter additional information" type="text" onChange={this.changeNote}/>
				</td>
	      	</tr>
	    );
  	}
}

export default Monster;