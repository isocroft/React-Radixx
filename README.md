# React-Radixx

A slim bridge library for easily integrating Radixx with ReactJS

## Installation

```bash

    npm i react-radixx --save
    
    yarn add react-radixx
```

## Getting Started

> ./actions/movieCharaterAction.js

```js

import { makeActionCreators, Payload  } from 'radixx'

const MovieCharacterAction = makeActionCreators({
	'addMovieChar':{
		type:"ADD_MOVIE_CHAR",
		actionDefinition: Payload.type.object
	}
});

export { MovieCharacterAction }

```

> ./traits/movieCharaterTrait.js

```js

import { makeStore, Helpers  } from 'radixx'
import { axios } from 'axios'

const store = makeStore('moviec', function(action, state){

    movie_chars = state;

    switch(action.actionType){
        case "ADD_MOVIE_CHAR":
            movie_chars.push(action.actionData);
        break;
    }
    
    return movie_chars;
}, []);

const MovieCharaterTrait = store.makeTrait(function(store){

    let listener = function(actionType, actionKey){
    
        console.log(`store data changed for ${actionType}`);
    };
    
    let oldState = null;

    return {
    
        shouldComponentUpdate(nextProps, nextState){
    
            return (
              ! Helpers.isEqual(oldState, this.getStoreState()) 
              || ! Helpers.isEqual(this.state, nextState)
            );
        },
    
        componentWillUnmount(){
           
            store.unsetChangeListener(
                listener
            );
        },
				
        componentDidMount(){
					
            store.setChangeListener(
                listener
            );

        },
        
        _post(url, data){

            return axios.post(
                url, 
                data
            );

        },
        
        getStoreState(){
            
            oldState = store.getState();
            
            return oldState;
        }
    };
    
});

export { MovieCharaterTrait }

```

> ./components/movieCharater.js

```js

import { Component } from 'react'
import { Helpers } from 'radixx'
import { withContainerTraits } from 'react-redux'
import { MovieCharaterTrait } from './traits/movieCharaterTrait'
import { MovieCharacterAction } from './actions/movieCharaterAction'

class MovieCharacterClass extends Component {

    constructor(props){
    
        super(props)
        
        this.state = {
            addButtonDisabled:false
        };
    }
    
    shouldComponentUpdate(nextProps, nextState){
        return (
                ! Helpers.isEqual(this.props, nextProps) ||
                ! Helpers.isEqual(this.state, nextState)
        );
    }
    
    onClick(event){
        
        MovieCharacterAction.addMovieChar();
    }
}

const MovieCharacter = withContainerTraits(
    MovieCharaterTrait, 
    MovieCharacterClass
);


return { MovieCharacter }

```

> ./App.js

```js

import { Component } from 'react'
import { attachMiddleware } from 'radixx'
import { MovieCharacter } from './components/movieCharater'

attachMidleware(function(next, action, previousStateObj){
        
        console.log("BEFORE DISPATCH: ", previousStateObj);
        
        let nextStateObj = next(
            action,
            previousStateObj
        );
        
        console.log("AFTER DISPATCH: ", nextStateObj);
});

class App extends Component {

    constructor(prop){
        super(props)
        
        this.state = {
            isLoading:true
        }
    }
    
    componentDidMount(){
    
        this.isLoading = (document.readyState !== "complete");
    }
    
    render(){
    
    	return <MovieCharacter {...this.props} />
    }
    
}

export App;

```

> ./index.js

```js

import { withRootBindings } from 'react-radixx'
import { render } from 'react-dom'
import { onDispatch, configure, onShutDown } from 'radixx'
import App from './components/App'

configure({
    runtime:{
        spaMode:true,
        shutDownHref:"/logout"
    }
});

onShutDown(function(appState){

});

render(
    withRootBindings(
    	App, 
    	{ onDispatch }
    ),
    document.body.lastElementChild 
);

```

## License

MIT
