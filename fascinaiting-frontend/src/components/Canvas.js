const canvasElement = document.getElementById('particleCanvas');
const context = canvasElement.getContext('2d');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
let particleList = [];
const particleCount = 100;

let currentScrollY = 0;
let previousScrollY = 0;
let scrollVelocity = 0;

window.addEventListener('resize', () => {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
});

window.addEventListener('scroll', () => {
  currentScrollY = window.scrollY;
  scrollVelocity = currentScrollY - previousScrollY;
  previousScrollY = currentScrollY;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvasElement.width;
    this.y = Math.random() * canvasElement.height - currentScrollY;
    this.radius = Math.random() * 5 + 1;
    this.velocityX = Math.random() * 3 - 1.5;
    this.velocityY = Math.random() * 3 - 1.5;
  }
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY + scrollVelocity * 0.1; // Apply scroll effect

    // Make particles bounce off the edges
    if (this.x <= 0 || this.x >= canvasElement.width) this.velocityX *= -1;
    if (this.y <= 0 || this.y >= canvasElement.height) this.velocityY *= -1;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = '#8C5523'; // Particle color
    context.fill();
  }
}

function initializeParticles() {
  particleList = [];
  for (let i = 0; i < particleCount; i++) {
    particleList.push(new Particle());
  }
}

function runAnimation() {
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  particleList.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(runAnimation);
}

initializeParticles();
runAnimation();