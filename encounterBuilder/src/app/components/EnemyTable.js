import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class EnemyTable extends React.Component {

	constructor(props){
	    super();
	    this.state = {
      		monsters: props.enemies,
      		encounter: [],
      		monstersIds: [],
      		searchValue: '',
      		currPage: 1,
      		maxPages: 0,
      		currMonsters: [],
      		pagination: []
	    }
    	this.addEnemy = this.addEnemy.bind(this);
    	this.updateSearch = this.updateSearch.bind(this);
    	this.buildPagination = this.buildPagination.bind(this);
    	this.changePage = this.changePage.bind(this);
	}

	updateSearch( e ){
		let temp = this.state.monsters;
		for( let i = 0; i < temp.length; i++ ){
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
			monsters: newProps.enemies,
			maxPages: Math.ceil(newProps.enemies.length / 10)
		}, () => {
			this.buildPagination();
		});
	}

	componentDidMount(){
		this.setState({ 
			monsters: this.props.enemies,
			maxPages: Math.ceil(this.props.enemies.length / 10)
		}, () => {
			this.buildPagination();
		});
	}

	addEnemy( monster ){
		this.setState({
			monsterIds: this.state.monstersIds.push(monster)
		});
		this.props.callbackParent(this.state.monstersIds);
	}

	buildPagination(){
		let temp = [];
		for( var i = (this.state.currPage - 1) * 10; i < (this.state.currPage) * 10; i++){
			if( this.state.monsters[i] == undefined ){
				break;
			}
			temp.push(this.state.monsters[i]);
		}
		this.setState({
			currMonsters: temp
		}, () => {
			let pagination = [];
			for( let i = 0; i < this.state.maxPages; i++ ){
				pagination.push(i);
			}
			this.setState({
				pagination: pagination
			});
		});
	}

	changePage(page){
		this.setState({
			currPage: page + 1
		}, () => {
			this.buildPagination();
		});
	}

  	render() {
    	return (
		  	<div>
		  		<input value={this.state.searchValue} onChange={this.updateSearch}></input>
		  		<table>
		  			<thead></thead>
		  			<tbody>
			  		{this.state.currMonsters.map((monster,key) => {
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
		  		{this.state.pagination.map((page) => {
	      		return (
	      			<button key={page} onClick={() => this.changePage(page)}>{page + 1}</button>
	      			)
	        	})}
		  	</div>
    	)
  	}
}

export default EnemyTable;
