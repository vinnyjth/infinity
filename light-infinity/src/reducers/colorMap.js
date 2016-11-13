const initialState = () => {
  // Can't map over array of undefined.'
  return (new Array(10).fill(null)).map((_current, column) => {
    return {
      column,
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
    };
  });
}

function modifyColumnColor({ state, colorKey, columnIndex, colorVal }){
  const nextState = state.slice(0);
  return nextState.map((el, index) => {
    if (columnIndex === index) {
      const color = Object.assign({}, el.color, { [colorKey]: parseInt(colorVal) } )
      return Object.assign({}, el, { color });
    }
    return Object.assign({}, el);
  })
}

const colorMap = (state = initialState(), action) => {
  switch (action.type) {
    case 'CHANGE_COLOR':
      const { colorKey, column: columnIndex, colorVal } = action.payload;
      return modifyColumnColor({ state, colorKey, columnIndex, colorVal });
    default:
      return state
  }
}

function changeColor({column, colorKey, colorVal}) {
  return {
    type: 'CHANGE_COLOR',
    payload: {
      column,
      colorKey,
      colorVal,
    }
  }
}

export {
  colorMap as default,
  changeColor,
} 