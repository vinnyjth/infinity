import React, { Component } from 'react';
import { LightCube } from './LightCube';
import { connect } from 'react-redux';

const rgbToHex = ({r, g, b}) => {
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function LightCubeIndicator(props){
  const { r, g, b } = props.colors;
  const style = {
    backgroundColor: rgbToHex({r, g, b}),
  }
  return (
    <LightCube {...props} 
      style={style}
      onCubeClick={()=> {}} 
      onColorChange={()=> {}}
      showSlider={false}
    /> 
  )
}


const mapStateToProps = (state, ownProps) => {
  return {
    colors: state.colorMap[ownProps.column].color,
  }
}

export default connect(mapStateToProps)(LightCubeIndicator)