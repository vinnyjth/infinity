const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.51.73');

let gr = 1000
let gg = 0
let gb = 0

function prepareVal(inputVal){
  const fraction = inputVal/255.0;
  var val = 1023 * fraction;
  if (val === undefined) {
    val = 0;
  }
  if (val > 1023) {
    val = 1023
  }
  if (val < 0) {
    val = 0
  }
  return Math.ceil(val)
}

function rgb(r, g, b) {
  const fR = prepareVal(r);
  const fG = prepareVal(g)
  const fB = prepareVal(b) 
  return `r:${fR} g:${fG} b:${fB}`
}


function change(r, g, b){
  return new Promise((resolve) => {
    client.publish('/vanity_lights', rgb(r, g, b), () => { resolve({r,g,b})});
  });
}

client.on('connect',  () => {
  client.subscribe('/vanity_lights');
  // cycle({r: 0, g: 0, b: 0}, ['g', 'r'], -20);
  change(0, 0, 255);  
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});

function cycle({r, g, b}, cycleVals, dir, originalVals) {
  change(r, g, b)
    .then((colors) => {
      const originalCycleVals = originalVals || cycleVals;
      if (!cycleVals.every((val) => val === null)){        
        newCycleVals = cycleVals.map((val) => {
          colors[val] += dir;
          console.log(colors[val]);
          if (colors[val] > 255 || colors[val] < 0){
            return null
          } else {
            return val
          }
        });
        setTimeout(() => {cycle(colors, newCycleVals, dir, originalCycleVals)}, 50);
      } else {
        cycle(colors, originalVals, -dir, originalVals);
      }       
  });
}