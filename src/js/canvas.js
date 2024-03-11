const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
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
    this.y += this.speedY + scrollSpeed * 0.1;

    if (this.x <= 0) {
      this.x = canvas.width; // Wrap around to the right side
    } else if (this.x >= canvas.width) {
      this.x = 0; // Wrap around to the left side
    }

    if (this.y <= 0) {
      this.y = canvas.height; // Wrap around to the bottom
    } else if (this.y >= canvas.height) {
      this.y = 0; // Wrap around to the top
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#336699";
    ctx.fill();
  }
}

function init() {
  particlesArray.length = 0;
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
