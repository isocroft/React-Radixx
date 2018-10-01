
const withPresentationHooks = (ActionHooks, Prsentation) => {

};

const withContainerTraits = ([StoreTrait, ...WrappedComponents]) => {

     class ContainerComposition extends React.Component {

	constructor(props){
		
		super(props)
		
		this.name = "";
	}
	     
   	render() {
		
			let SingleComponentRender = WrappedComponents.length === 1;
		
			let Components = WrappedComponents.map(function(WrappedComponent){
				
					let props = {	
					};
				
					if(typeof StoreTrait.getStoreState !== 'function'){
					   throw new Error();
				   	}
				
					let state = StoreTrait.getStoreState();
				
					if(!SingleComponentRender){
						
						if(typeof WrappedComponent.name !== "string"
							|| WrappedComponent.name.length === 0){
						   throw new Error();
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
		
		},
	     
	     	componentWillRecieveProps(...args){
		
		}
	     
     };

     for(let memberName in StoreTrait){

         let member = StoreTrait[memberName];

         if(typeof member === "function"
	   	&& (memberName in mappingComponentToTrait)
	   		&& memberName !== "render"){

              ContainerComposition.prototype[memberName] = member;
         }else{
	 
	 	;
	 }

     }

     return ContainerComposition;

};

const withRootBindings = (RootComponent, {onDispatch}) => {

	class RootComposition extends React.Component {
		
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

export { withRootBindings, withContainerTraits };
