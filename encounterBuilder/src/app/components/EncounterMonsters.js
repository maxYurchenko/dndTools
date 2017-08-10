import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class EncounterMonsters extends React.Component {

	constructor(props){
		super();
		this.state = {
			monsters: props.monsters,
			selectedMonsters: [],
			totalExp: 0
		}
	}

	componentWillReceiveProps(newProps) {
		var totalExp = 0;
		for( let m of newProps.selectedMonsters ){
			totalExp += parseInt(m.data.exp);
		}
		this.setState({
			selectedMonsters: newProps.selectedMonsters,
			totalExp: totalExp
		});
	}

	removeEnemy( monster ){
		var removed = false;
		var totalExp = 0;
		for( var i = 0; i < this.state.selectedMonsters.length; i++ ){
			totalExp += parseInt(this.state.selectedMonsters[i].data.exp);
			if ( this.state.selectedMonsters[i]._id == monster._id && !removed ){
				var tempMonsters = this.state.selectedMonsters;
				tempMonsters.splice(i, 1);
				removed = true;
			}
		}
		this.setState({
			selectedMonsters: tempMonsters,
			totalExp: totalExp
		});
	}

	addEnemy( monster ){
		var totalExp = 0;
		var tempMonsters = this.state.selectedMonsters;
		tempMonsters.push(monster);
		for( let m of tempMonsters ){
			totalExp += parseInt(m.data.exp);
		}
		this.setState({
			selectedMonsters: tempMonsters,
			totalExp: totalExp
		});
	}

	render() {
		return (
			<div className="fight-monsters-block">
				<h2 className="fight-monsters-title">Total experience: {this.state.totalExp}</h2>
				<table>
					<thead>
						<th colSpan="2">Actions</th>
						<th>Monster</th>
						<th>CR</th>
						<th>Experience</th>
					</thead>
					<tbody>
					{this.state.selectedMonsters.map((monster,key) => {
					return (
						<tr key={key}>
							<td>
								<button className="button-primary" onClick={() => this.removeEnemy(monster)}>Remove</button>
							</td>
							<td>
								<button className="button-primary" onClick={() => this.addEnemy(monster)}>Add</button>
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

export default EncounterMonsters;
