const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
const numberOfParticles = 400;

let scrollY = 0;
let lastScrollY = 0;
let scrollSpeed = 0;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  scrollSpeed = scrollY - lastScrollY;
  lastScrollY = scrollY;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - scrollY;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY + scrollSpeed * 0.1; // Apply scroll effect

    // Make particles bounce off the edges
    if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#336699"; // Particle color
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();
