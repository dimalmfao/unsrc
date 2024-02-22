// Get references to the input elements and the canvas
const gravitationalConstantInput = document.getElementById("g");

const velocityXInput = document.getElementById("velocityX");
const velocityYInput = document.getElementById("velocityY");
const massInput = document.getElementById("mass");
const displayVelocityX = document.getElementById("vx");
const displayVelocityY = document.getElementById("vy");
const displayMass = document.getElementById("m");

const velocityX2Input = document.getElementById("velocityX2");
const velocityY2Input = document.getElementById("velocityY2");
const mass2Input = document.getElementById("mass2");
const displayVelocityX2 = document.getElementById("vx2");
const displayVelocityY2 = document.getElementById("vy2");
const displayMass2 = document.getElementById("m2");

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let zoom = 0.5;

function dezoom() {
  zoom -= 0.1;
}

function zoomIn() {
  zoom += 0.1;
}

class Planet {
  constructor(x, y, vx, vy, radius, mass, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.mass = mass;
    this.color = color;
    this.position = [];
  }

  update(x, y, vx, vy, mass) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
  
  updateMass(mass) {
  	this.mass = mass;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Set up the initial state of the simulation
var state = {
  G: 500,
  planet1: new Planet(400, 100, 3.5, 0, 20, 1, "blue"),
  planet2: new Planet(450, 450, 0, 0, 50, 10, "red"),
};

function reset() {
  state.planet1.update(400, 100, 3.5, 0);
  state.planet2.update(450, 450, 0, 0);
  state.planet1.updateMass(1);
  state.planet2.updateMass(10);
  state.G = 500;

  massInput.value = 1;
  mass2Input.value = 10;
  gravitationalConstantInput.value = 500;
  
  updateDisplayValue();
  zoom = 0.5;
  ctx.resetTransform();

  state.planet1.position = [];
  state.planet2.position = [];
}

// Function to update the position and velocity of planet1 based on the input values
function updatePlanet() {
  state.planet1.updateMass(
    parseFloat(massInput.value)
  );
  
  state.planet2.updateMass(
    parseFloat(mass2Input.value)
  );
  
  updateDisplayValue();
}

function updateGravitationalConstant() {
	state.G = gravitationalConstantInput.value;
}

massInput.addEventListener("change", updatePlanet);
mass2Input.addEventListener("change", updatePlanet);
gravitationalConstantInput.addEventListener("change", updateGravitationalConstant);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateInputValues();
  
  ctx.save();
  
  let camera = {
    x: state.planet2.x,
    y: state.planet2.y
  };

  ctx.translate(
    canvas.width / 2 - (camera.x * zoom),
    canvas.height / 2 - (camera.y * zoom)
  );
  ctx.scale(zoom, zoom);
  
  // If the positions array contains more than 100 elements, remove the oldest element
  if (state.planet1.position.length > 3000) {
    state.planet1.position.shift();
  }
  if (state.planet2.position.length > 3000) {
    state.planet2.position.shift();
  }

  // Draw a line representing the path of planet1
  ctx.beginPath();
  ctx.strokeStyle = state.planet1.color;
  for (let i = 0; i < state.planet1.position.length; i++) {
    let x = state.planet1.position[i].x;
    let y = state.planet1.position[i].y;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw a line representing the path of planet2
  ctx.beginPath();
  ctx.strokeStyle = state.planet2.color;
  for (let i = 0; i < state.planet2.position.length; i++) {
    let x = state.planet2.position[i].x;
    let y = state.planet2.position[i].y;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  state.planet1.draw(ctx);
  state.planet2.draw(ctx);
  
  ctx.restore();
}

// Update the position and velocity of planet1 over time
function update() {
  // Calculate the distance between planet1 and planet2
  const dx = state.planet2.x - state.planet1.x;
  const dy = state.planet2.y - state.planet1.y;
  const r = Math.sqrt(dx * dx + dy * dy);

  // Calculate the force of attraction between planet1 and planet2
  const F = state.G * state.planet1.mass * state.planet2.mass / (r * r);
  const theta = Math.atan2(dy, dx);
  const Fx = F * Math.cos(theta);
  const Fy = F * Math.sin(theta);

  // Calculate the acceleration of planet1
  const ax = Fx / state.planet1.mass;
  const ay = Fy / state.planet1.mass;

  // Update the velocity of planet1
  state.planet1.vx += ax;
  state.planet1.vy += ay;

  // Update the position of planet1
  state.planet1.x += state.planet1.vx;
  state.planet1.y += state.planet1.vy;

  // Store the current position of planet1 in an array
  state.planet1.position.push({ x: state.planet1.x, y: state.planet1.y });
  
  // Same shit for planet2
  const ax2 = Fx / state.planet2.mass;
  const ay2 = Fy / state.planet2.mass;

  state.planet2.vx += ax2;
  state.planet2.vy += ay2;

  state.planet2.x += state.planet2.vx;
  state.planet2.y += state.planet2.vy;

  state.planet2.position.push({ x: state.planet2.x, y: state.planet2.y });

  // Draw the planets and their positions
  draw();
  
  window.requestAnimationFrame(update);
}

function updateInputValues() {
  velocityXInput.value = state.planet1.vx;
  velocityYInput.value = state.planet1.vy;
  
  velocityX2Input.value = state.planet2.vx;
  velocityY2Input.value = state.planet2.vy;
  
  updateDisplayValue();
}

function updateDisplayValue() {
  displayVelocityX.innerHTML = velocityXInput.value;
  displayVelocityY.innerHTML = velocityYInput.value;
  displayMass.innerHTML = massInput.value;
  
  displayVelocityX2.innerHTML = velocityX2Input.value;
  displayVelocityY2.innerHTML = velocityY2Input.value;
  displayMass2.innerHTML = mass2Input.value;
}

update();
