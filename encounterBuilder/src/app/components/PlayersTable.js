import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Player from '../components/Player';

class PlayersTable extends React.Component {

    constructor(props){
        super();
        this.state = {
            players: [],
        }
        this.playerChanged = this.playerChanged.bind(this);
    }

    componentDidMount(){
        this.setState({ 
            players: this.props.players
        });
    }

    playerChanged(player){
        let temp = this.state.players;
        for( let p of this.state.players){
            if( p._id == player._id ){
                p = player;
                break;
            }
        }
        this.setState({
            players: temp
        }, () => {
            this.props.callbackParent(this.state.players);
        });
    }

    render() {
        return (
            <div>
                <table className="fight-builder-table">
                    <thead>
                        <th>Initiative</th>
                        <th>Name</th>
                    </thead>
                    <tbody>
                    {this.state.players.map((player,key) => {
                    return (
                        <Player player={player} key={key} callbackParent={this.playerChanged} />
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PlayersTable;
