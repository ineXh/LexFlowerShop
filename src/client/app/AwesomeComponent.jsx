import React from 'react';
//var Main = require('./main.js');

class AwesomeComponent extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props)
    this.state = {likesCount : 0};
    this.onLike = this.onLike.bind(this);

    this.onXMinus = props.input.onXMinus.bind(this);
    this.onXPlus = props.input.onXPlus.bind(this);
  }

  onLike () {
    let newLikesCount = this.state.likesCount + 1;
    this.setState({likesCount: newLikesCount});
  }
  onX () {
    console.log('onX')
  }
  onY () {
    console.log('onY')

  }

  render() {
    return (
      <div>
        Likes : <span>{this.state.likesCount}</span>
        <div><button onClick={this.onLike}>Like Me</button></div>
        <div><button onClick={this.onXMinus}>X -</button></div>
        <div><button onClick={this.onXPlus}>X +</button></div>
        <div><button onClick={this.onY}>Content Y</button></div>
      </div>
    );
  }

}

export default AwesomeComponent;