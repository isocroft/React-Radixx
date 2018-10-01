import { Component } from 'react'

const withPresentationHooks = (ActionHooks, PresentationComponent) => {

	class PresentationComposition extends Component {
		
		constructor(props){
			super(props)
		}
		
		render(){
		
			return <PresentationComponent {...this.props} />
		}
	}
	
	return PresentationComposition;
};

const withContainerTraits = ([StoreTrait, ...WrappedPresentationComponents]) => {

     class ContainerComposition extends Component {

	constructor(props){
		
		super(props)
		
		this.name = "";
	}
	     
   	render() {
		
			let SingleComponentRender = WrappedPresentationComponents.length === 1;
		
			let Components = WrappedPresentationComponents.map(function(WrappedComponent){
				
					let props = {	
					};
				
					if(typeof StoreTrait.getStoreState !== 'function'){
					   throw new Error("function [getStoreState] MUST be defined on stores' trait");
				   	}
				
					let state = StoreTrait.getStoreState();
				
					if(!SingleComponentRender){
						
						if(typeof WrappedComponent.name !== "string"
							|| WrappedComponent.name.length === 0){
						   throw new Error("field [name] MUST be defined as stores' ");
						}
						
						props[WrappedComponent.name] = state[WrappedComponent.name];
					}else{
						props = state;
					}
				
					return <WrappedComponent {...props} />
				
			});
		
			return { Components };

	}
     }
	
	
	/* `Arrow functions` don't respect { this } so we have to normalize */ 
     let mappingComponentToTrait = {
	     
     		componentWillMount(...args){
                 	return StoreTrait.componentWillMount.apply(this, [...args]);
	    	},
	     
	     	componentWillUnmout(...args){
			return StoreTrait.componentWillUnmout.apply(this, [...args]);
		},
	     
	     	componentDidUpdate(...args){
			return StoreTrait.componentDidUpdate.apply(this, [...args]);
		},
	     
	     	componentWillUpdate(...args){
			return StoreTrait.componentWillUpdate.apply(this, [...args]);
		},
	     
	     	shouldComponentUpdate(...args){
			return StoreTrait.shouldComponentUpdate.apply(this, [...args]);
		},
	     
	     	componentWillRecieveProps(...args){
			return StoreTrait.componentWillRecieveProps.apply(this, [...args]);
		}
	     
     };

     for(let memberName in StoreTrait){

         let member = StoreTrait[memberName];

         if(typeof member === "function"
	   		&& memberName !== "render"){
		if((memberName in mappingComponentToTrait)){
			ContainerComposition.prototype[memberName] = mappingComponentToTrait[memberName];
		}else{
              		ContainerComposition.prototype[memberName] = member;
		}
         }

     }

     return ContainerComposition;

};

const withRootBindings = (RootComponent, {onDispatch}) => {

	class RootComposition extends Component {
		
		constructor(prop){

			super(props)

			this.createDispatchHatch = function(){

				return function(appstate){

					this.setState({

					});

				}
			};
		}

		componentWillMount(){

			onDispatch(
				this.createDispatchHatch(

				)
			);

		}

		render(){

			return <RootComponent {...this.props} />
		}
	}
		
	return RootComposition;
};

export { withRootBindings, withContainerTraits, withPresentationHooks };
