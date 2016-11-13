import React, { Component } from 'react';
import { times } from 'lodash';
import { connect } from 'react-redux';

import './LightScheduler.css';
import LightRow from './LightRow.js';

import { change as sendColorUpdate } from './utils/mqtt-helper'

class LightScheduler extends Component {
  constructor(props){
    super(props);
    this.state = {
      lightScheduleTimer: null,
      activeCubeIndex: 0,
      totalCubes: 10,
    }
  }

  componentDidMount(){
    const lightScheduleTimer = setInterval(this.nextCube.bind(this), 500)
    this.setState({lightScheduleTimer});
  }

  componentWillUnmount(){
    clearInterval(this.state.lightScheduleTimer);
  }

  render() {
    const colors = ['r', 'g', 'b'];
    return (
      <div>
        <LightRow row="i" totalCubes={this.state.totalCubes} activeCubeIndex={this.state.activeCubeIndex} />
        {times(3, (row) => {
          return (
            <LightRow row={colors[row]} totalCubes={this.state.totalCubes} activeCubeIndex={this.state.activeCubeIndex} />
          )
        })}
      </div>
    );
  }

  nextCube(){
    let nextCubeIndex = this.state.activeCubeIndex + 1;
    if (nextCubeIndex >= this.state.totalCubes){
      nextCubeIndex = 0;
    }
    this.setState({ activeCubeIndex: nextCubeIndex }, () => {
      const { r, g, b } = this.props.colorMap[this.state.activeCubeIndex].color;
      sendColorUpdate(r, g, b);
    });
  }
}

const mapStateToProps = ({ colorMap }) => {
  return {
    colorMap
  }  
}

export default connect(mapStateToProps)(LightScheduler);
