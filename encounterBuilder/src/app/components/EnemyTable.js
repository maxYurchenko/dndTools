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
            filteredMonsters: [],
            pagination: [],
            pageSize: 10
        }
        this.addEnemy = this.addEnemy.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.buildPagination = this.buildPagination.bind(this);
        this.changePage = this.changePage.bind(this);
        this.nextPrevChange = this.nextPrevChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            monsters: newProps.enemies,
            filteredMonsters: newProps.enemies,
            maxPages: Math.ceil(newProps.enemies.length / 10)
        }, () => {
            this.buildPagination();
        });
    }

    componentDidMount(){
        this.setState({
            monsters: this.props.enemies,
            filteredMonsters: this.props.enemies,
            maxPages: Math.ceil(this.props.enemies.length / 10)
        }, () => {
            this.buildPagination();
        });
    }

    updateSearch( e ){
        let temp = this.state.monsters;
        let filteredMonsters = [];
        for( let i = 0; i < temp.length; i++ ){
            if( temp[i].displayName.toLowerCase().indexOf(e.target.value.toLowerCase()) == -1 ){
                temp[i].show = false;
            }else{
                temp[i].show = true;
                filteredMonsters.push(temp[i]);
            }
        }
        this.setState({
            searchValue: e.target.value,
            monsters: temp,
            filteredMonsters: filteredMonsters
        }, () => {
            this.buildPagination();
        });
    }

    buildPagination(){
        let temp = [];
        for( let i = (this.state.currPage - 1) * 10; i < this.state.filteredMonsters.length; i++){
            if( this.state.filteredMonsters[i] == undefined ){
                break;
            }
            if( temp.length >= 10 ){
                break;
            }
            if( this.state.filteredMonsters[i].show == false ){
                continue;
            }
            temp.push(this.state.filteredMonsters[i]);
        }
        this.setState({
            currMonsters: temp,
            maxPages: Math.ceil(this.state.filteredMonsters.length / 10)
        }, () => {
            let pagination = [];
            for( let i = this.state.currPage - 3; i < this.state.currPage + 3; i++ ){
                if( i < 0 ){
                    continue;
                }
                if( i >= this.state.maxPages){
                    break;
                }
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

    addEnemy( monster ){
        this.setState({
            monsterIds: this.state.monstersIds.push(monster)
        });
        this.props.callbackParent(this.state.monstersIds);
    }

    nextPrevChange( page ){
        if( this.state.currPage + parseInt(page) < this.state.maxPages + 1 && this.state.currPage + parseInt(page) > 0 ){
            this.setState({
                currPage: this.state.currPage + parseInt(page)
            }, () => {
                this.buildPagination();
            });
        }
    }

    render() {
        return (
            <div className="fight-builder-block">
                <div className="fight-builder-field">
                   <input className="fight-builder-input" placeholder="Start input name..." value={this.state.searchValue} onChange={this.updateSearch}></input>
                </div>
                <table className="fight-builder-table">
                    <thead>
                        <th>Actions</th>
                        <th>Monster</th>
                        <th>CR</th>
                        <th>Experience</th>
                    </thead>
                    <tbody>
                    {this.state.currMonsters.map((monster,key) => {
                    return (
                        <tr key={key}>
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
                <div className="pagination-list">
                    <button className="pagination-item previous" onClick={() => this.nextPrevChange("-1")}>Previous</button>
                    {this.state.pagination.map((page) => {
                    if( page == this.state.currPage-1 ){
                        var tempClass = "active";
                    } else {
                        var tempClass = "";
                    }
                    return (
                        <button className={"pagination-item " + tempClass} key={page} onClick={() => this.changePage(page)}>{page + 1}</button>
                        )
                    })}
                    <button className="pagination-item next" onClick={() => this.nextPrevChange("1")}>Next</button>
                </div>
            </div>
        )
    }
}

export default EnemyTable;
