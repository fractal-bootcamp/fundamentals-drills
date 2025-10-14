let launchReady = false;
// let fuelLevel = 17000;
// let crewReady = false;
let crewStatus = true;
let computerStatus = 'green';

// if (fuelLevel >= 20000) {
//   console.log('Fuel level cleared.');
//   launchReady = true;
// } else {
//   console.log('WARNING: Insufficient fuel!');
//   launchReady = false;
// }

if (crewStatus && computerStatus === 'green') {
  console.log('Crew & computer cleared.');
  launchReady = true;
} else {
  console.log('WARNING: Crew or computer not ready!');
  launchReady = false;
}