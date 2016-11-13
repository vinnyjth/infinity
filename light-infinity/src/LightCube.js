import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeColor } from './reducers/colorMap';

import './LightCube.css'

function LightCube(props){
  return(
    <div className='cube' style={props.style} onClick={props.onCubeClick}>
      {props.color} : {props.column}
      <div className='color-slider' onChange={(event) => {props.onColorChange(event.target.value)}} style={props.showSlider ? {display: 'block'} : {display: 'none'}}>
        <input type='range' min="0" max="255" style={{opacity: 1.0}} defaultValue={props.colorVal} />
      </div>
    </div>
  )
}

class LightCubeContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      showSlider: false,
    };
  }

  rgbToHex({r, g, b}) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  onCubeClick(){
    this.setState({showSlider: !this.state.showSlider});
  }

  onColorChange(colorVal){
    console.log(colorVal);
    this.props.changeColor({ 
      colorKey: this.props.color,       
      column: this.props.column,
      colorVal,
    });
  }

  buildColor(){
    const colors = {r: 0, g: 0, b: 0};
    colors[this.props.color] = 255;
    return this.rgbToHex(colors);
  }

  render (){
    const activeStyle = {
      backgroundColor: this.buildColor(),
      opacity: (((this.props.colorVal || 1)/255.0) - 0.3) || 0.01
    }
    const normalStyle = {
      backgroundColor: this.buildColor(),
      opacity: ((this.props.colorVal || 1)/255.0)
    }
    const style = this.props.active ? activeStyle : normalStyle;
    return (  
      <LightCube {...this.props} 
        style={style}
        onCubeClick={this.onCubeClick.bind(this)} 
        onColorChange={this.onColorChange.bind(this)}
        showSlider={this.state.showSlider} 
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    colorVal: state.colorMap[ownProps.column].color[ownProps.color],
  }
}

const mapDispatchToProps = {
  changeColor,
}

const modCubeContainer = connect(mapStateToProps, mapDispatchToProps)(LightCubeContainer)
export {
  modCubeContainer as default,
  LightCube,
};