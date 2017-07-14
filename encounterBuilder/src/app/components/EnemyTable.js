import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class EnemyTable extends React.Component {

	constructor(props){
	    super();
	    this.state = {
      		monsters: props.enemies,
      		encounter: [],
      		monstersIds: []
	    }
    	this.addEnemy = this.addEnemy.bind(this);
	}

	componentWillReceiveProps(newProps) {
		this.setState({ 
			monsters: newProps.enemies
		});
	}

	addEnemy( monster ){
		this.setState({
			monsterIds: this.state.monstersIds.push(monster)
		});
		this.props.callbackParent(this.state.monstersIds);
	}

  	render() {
    	return (
		  	<div>
		  		<table>
		  			<thead></thead>
		  			<tbody>
			  		{this.state.monsters.map((monster,key) => {
		      		return (
		      			<tr key={key}>
			      			<td>
			      				<a onClick={() => this.addEnemy(monster)}>Add</a>
			      			</td>
			      			<td>
			      				{monster.displayName}
			      			</td>
			      			<td>
			      				{monster.data.cr}
			      			</td>
			      			<td>
			      				{monster.data.exp}
			      			</td>
		      			</tr>
			          	)
		        	})}
		        	</tbody>
	        	</table>
		  	</div>
    	)
  	}
}

export default EnemyTable;
