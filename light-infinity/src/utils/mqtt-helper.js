import mqtt from 'mqtt';
const client = mqtt.connect('ws://192.168.51.73:9001');

function prepareVal(inputVal){
  const fraction = inputVal/256.0;
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
});

export {
  change
};