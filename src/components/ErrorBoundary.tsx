import React from 'react';
import ErrorPage from '../pages/Error';

type State = {error: Error | null, info?: React.ErrorInfo | null};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props:any){
    super(props);
    this.state = {error: null, info: null};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo){
    this.setState({error, info});
    // you could also log to remote here
  }

  render(){
    if(this.state.error){
      return <ErrorPage error={this.state.error} info={this.state.info} onBack={()=> this.setState({error:null, info:null})} />;
    }
    return this.props.children as any;
  }
}
