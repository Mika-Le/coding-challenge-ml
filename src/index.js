import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './index.css';


function Card(props) {
  if(props.character){
    return (
      <div className='character-card'>
        <label className='name'>
          {props.character.name}
        </label>
        <img src={props.character.image} alt={props.character.name}>
        </img>
        <label>
          Status: {props.character.status}
        </label>
        <label>
          Species: {props.character.species}
        </label>
        <label>
          Gender: {props.character.gender}
        </label>
      </div>
    );
  }
  else {
    return null;
  }
}

class RaM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      characters: [],
    }
  }

  //handle search input. Character names for suggestion list are returned based on current searchterm
  changeText = (e) => {
    fetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `query ($name: String) {
          characters(filter: { name: $name }) {
            results {
              id
              name
            }
          }
        }`,
        variables: {
          name: e.target.value
        }
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(async (data) => {
      var result = await data.json();
        if(result.data.characters !== null){
          this.setState({
            suggestions: result.data.characters.results,
          });
        }
        else {
          this.setState({
            suggestions: [],
          });
        }
    });
  }

  //handle enter press. Use current value for character search
  handleKeypress = (e) => {
    if (e.key === 'Enter') {
      this.selectSuggestion(e.target.value);
    }
  }

  //Get character details for selected searchterm
  //Characters with the same name are all returned since they are not discernible just from name in suggestions
  selectSuggestion(charname) {
    fetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `query ($name: String) {
          characters(filter: { name: $name }) {
            results {
              id
              name
              status
              species
              gender
              image
            }
          }
        }`,
        variables: {
          name: charname
        }
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(async (data) => {
      var result = await data.json();
      if(result.data.characters !== null){
        this.setState({
          characters: result.data.characters.results,
          suggestions: []
        });
      }
      else {
        this.setState({
          characters: [],
        });
      }
    });
  }
  
  render() {
    //results from current searchterm as suggestions
    const suggestions = this.state.suggestions.map((char) => {
      return (
        <li key={char.id} onClick={() => this.selectSuggestion(char.name)}>{char.name}</li>
      )
    })

    //Character details for characters returned by search
    const chars = this.state.characters.map((char) => {
      return (
        <div key={char.id} className='col-2'>
          <Card character={char}/>
        </div>
      )
    })

    return (
      <div className='container'>
        <div className='header'>
          <h1>Coding Challenge: Rick and Morty</h1>
          <label>by Mareike Leja</label>
        </div>
        <div className='row'>
          <div className='col-12'>
            <input 
            type='text' 
            placeholder='Enter Character Name...'
            onChange={this.changeText}
            onKeyPress={this.handleKeypress}/>
            <div className='search-container'>
              <ul className='suggestions'>{suggestions}</ul>   
            </div> 
          </div>
          {chars}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <RaM />,
  document.getElementById('root')
);


