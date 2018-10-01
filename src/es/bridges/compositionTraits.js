const withPresentationTraits = (WrappedComponent, StoreTriat) => {

};

const withContainerTraits = (WrappedComponent, StoreTriat) => {

     class ContainerComposition extends React.Component {

           componentWillMount(...args){

                 StoreTrait.componentWillMount.apply(this, [...args]);

	    }

           getDefaultProps(){

                 return StoreTrait.getDefaultProps();

           }

   	     render() {
      		return (
        		/*<WrappedComponent
          			load={this._apply}
          			{...this.props}
        		/>*/

			<WrappedComponent
          			{...this.props}
        		/>
		);

     }

     for(let attribute in StoreTrait){

         let method = StoreTrait[attribute];

         if((attribute.indexOf('_') + 1) 
	       && typeof method == "function"){

              ContainerComposition.prototype[attribute.substring(1)] = method;
         }

     }

     return ContainerComposition;

};

const withRootBindings = (WrappedComponent, {onDispatch}) => {

};

export { withRootBindings, withContainerTraits, withPresentationTraits };
