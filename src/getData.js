// export const UserData = [
//   {
//     altitude: 1739.458501,
//     xaccel: -4.99446518,
//     yaccel: 2.070443925,
//     zaccel: 42.02583239,
//     elevator: -0.3,
//     aileron: -0.4,
//     rudder: -0.5,
//     time: 0,

//   },
//   {
//     altitude: 1742.397422,
//     xaccel: -2.660157122,
//     yaccel: -2.744086054,
//     zaccel: -5.079968398,
//     elevator: -0.3,
//     aileron: -0.5,
//     rudder: -0.7,
//     time: 10,
//   },
//   {
//     altitude: 1682.78605,
//     xaccel: -5.942640007,
//     yaccel: 21.64445727,
//     zaccel: -64.57329356,
//     elevator: 0.8,
//     aileron: -0.6,
//     rudder: 0.1,
//     time: 15,
//   },
//   {
//     altitude: 1529.858559,
//     xaccel: -13.72723668,
//     yaccel: -11.5677186,
//     zaccel: 98.69377486,
//     elevator: -1.0,
//     aileron: -1.0,
//     rudder: -1.0,
//     time: 20,
//   },
//   {
//     altitude: 1400.604259,
//     xaccel: 5.937258692,
//     yaccel: 29.51422604,
//     zaccel: -119.6622926,
//     elevator: -0.2,
//     aileron: 0.0,
//     rudder: 0.8,
//     time: 28,
//   },
// ];


import { flightData } from "./Data";

const parseData = (csvData) => {
  const lines = csvData.trim().split('\n');
  const headers = lines.shift().split(',');
  let flightDuration = null;
  let reward = null;

  const flightData = lines.reduce((accumulator, line, index) => {
    if (index < 1 || index % 200 === 0) {
      const values = line.split(',');
      const flightEntry = {};
      headers.forEach((header, i) => {
        if (header === 'altitude' || header === 'xaccel' || header === 'yaccel' || header === 'zaccel' || header === 'elevator' || header === 'aileron' || header === 'rudder') {
          flightEntry[header] = parseFloat(values[i]);
        } else if (header === 'Flight Duration') {
          flightDuration = parseFloat(values[i]);
        } else if (header === 'Reward') {
          reward = parseFloat(values[i]);
        }
      });
      flightEntry.time = index + 1;
      accumulator.push(flightEntry);
    }
    return accumulator;
  }, []);


  flightData.forEach(entry => {
    entry['Flight Duration'] = flightDuration;
    entry['Reward'] = reward;
  });

  return flightData;
};


const UserData = parseData(flightData);

export { UserData };


