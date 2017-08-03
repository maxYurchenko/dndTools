import React, { Component } from 'react'
import axios from 'axios';
import { Switch, Route } from 'react-router-dom';

class Player extends React.Component {


  	constructor(){
	    super();
        this.state = {
            player: [],
            initiative: ''
        }
    	this.updateInitiative = this.updateInitiative.bind(this);
  	}

    componentDidMount(){
        this.setState({ 
            player: this.props.player
        });
    }

    updateInitiative( e ){
    	let temp = this.state.player;
    	temp.data.initiative = parseInt(e.target.value);
    	this.setState({
    		initiative: e.target.value,
    		player: temp
    	}, () => {
    		this.props.callbackParent(this.state.player);
    	});

    }

  	render() {  
	    return (
            <tr>
                <td>
                    <input value={this.state.initiative} onChange={this.updateInitiative}/>
                </td>
                <td>
                    {this.state.player.displayName}
                </td>
            </tr>
	    );
  	}
}

export default Player;