import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class EnemyTable extends React.Component {

	constructor(props){
	    super();
	    this.state = {
      		monsters: props.enemies,
      		encounter: [],
      		monstersIds: [],
      		searchValue: ''
	    }
    	this.addEnemy = this.addEnemy.bind(this);
    	this.updateSearch = this.updateSearch.bind(this);
	}

	updateSearch( e ){
		let temp = this.state.monsters;
		for( let i = 0; i < temp.length; i++ ){
			console.log(temp[i].displayName);
			if( temp[i].displayName.toLowerCase().indexOf(e.target.value.toLowerCase()) == -1 ){
				temp[i].show = false;
			}else{
				temp[i].show = true;
			}
		}
  		this.setState({
  			searchValue: e.target.value,
  			monsters: temp
  		});
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
		  		<input value={this.state.searchValue} onChange={this.updateSearch}></input>
		  		<table>
		  			<thead></thead>
		  			<tbody>
			  		{this.state.monsters.map((monster,key) => {
			  		if( monster.show == false ){
			  			return ;
			  		}
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
