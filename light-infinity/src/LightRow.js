import React, { Component } from 'react';
import { times } from 'lodash';

import LightCube from './LightCube.js';
import LightCubeIndicator from './LightCubeIndicator.js';

function LightRow(props) {
  const { row, totalCubes, activeCubeIndex } = props; 
  const LightCubeComponent = row === 'i' ? LightCubeIndicator : LightCube;
  return (
    <div key={row} className='row'>
      {times(totalCubes, (column) => {
        return <LightCubeComponent color={row} key={`${column}-${row}`} active={column === activeCubeIndex} column={column} />; 
      })}
    </div>
  )
};

export default LightRow;