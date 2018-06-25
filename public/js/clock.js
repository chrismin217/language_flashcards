console.log('clock script.');

let H = 0;
let M = 0;
let S = 0;

function degreesToRadius(d) {
	return (2 * d / 360) * Math.PI;
};

function vec2ang(x, y) {
  let angleInRadians = Math.atan2(y, x);
  let angleInDegrees = (angleInRadians / Math.PI) * 180.0;
  return angleInDegrees;
};

function ang2vec(angle) {
	let radians = angle * (Math.PI / 180.0);
	let x = Math.cos(radians);
	let y = Math.sin(radians);	
	let a = new Segment(0, 0, x, y);
	let u = a.normal().unit();
	return [u.vecx, u.vecy];
};

/*Every second, rotate the clock respective clock hands*/
setInterval(() => {

  let minute = document.getElementById("minute");
  let hour = document.getElementById("hour");
  let second = document.getElementById("second");
  
  S = new Date().getSeconds() * 6 - 90;
  M = new Date().getMinutes() * 6 - 90;
  H = new Date().getHours() * 30 - 90;
  
  second.style.transform = 'rotate(' + S + 'deg)';
  minute.style.transform = 'rotate(' + M + 'deg)';
  hour.style.transform = 'rotate(' + H + 'deg)';

}, 10);


let nc = document.getElementById("notch-container");
let angle = 0;
let rotate_x = 78;
let rotate_y = 0;

for (let i = 0; i < 60; i++) {
  let thin = document.createElement("div");
  let x = rotate_x * Math.cos(angle) - rotate_y * Math.cos(angle);
  let y = rotate_y * Math.cos(angle) + rotate_x * Math.sin(angle);
  let r = vec2ang(x, y);
  thin.className = "thin";
  thin.style.left = 80 + x + "px";
  thin.style.top = 84 + y + "px";
  thin.style.transform = "rotate(" + r + "deg)";
  nc.appendChild(thin);
  angle +=  (Math.PI / 300) * 10;
};

//reset
angle = 0;
rotate_x = 78;
rotate_y = 0;

for (let i = 0; i < 12; i++) {
  let notch = document.createElement("div");
  let x = rotate_x * Math.cos(angle) - rotate_y * Math.cos(angle);
  let y = rotate_y * Math.cos(angle) + rotate_x * Math.sin(angle);
  let r = vec2ang(x, y);
  notch.className = "notch";
  notch.style.left = 80 + x + "px";
  notch.style.top = 84 + y + "px";
  notch.style.transform = "rotate(" + r + "deg)";
  nc.appendChild(notch);
  angle +=  (Math.PI / 60) * 10;
};