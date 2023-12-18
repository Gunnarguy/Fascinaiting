import { requestAnimationFrame } from 'some-package'; // Add missing import statement
import React, { useEffect } from 'react';

// Your JavaScript code starts here

// Dropdown button functionality
var dropdown = document.getElementById("headerDropdown");
var dropdownContent = document.getElementById("headerDropdownContent");

// Add event listeners to handle opening and closing of the dropdown
dropdown.addEventListener("click", function() {
  dropdownContent.classList.toggle("hidden");
});

// Click anywhere outside the dropdown to close
window.addEventListener("click", function(event) {
  if (!event.target.matches("#headerDropdown")) {
    if (!dropdownContent.classList.contains("hidden")) {
      dropdownContent.classList.add("hidden");
    }
  }
});

// Canvas particle animation code
const canvas = document.getElementById("networkCanvas");
const context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let particles = [];
const numParticles = 100;
const maxDistance = 150;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velX = (Math.random() - 0.5) * 2;
    this.velY = (Math.random() - 0.5) * 2;
  }
  update() {
    this.x += this.velX;
    this.y += this.velY;
    if (this.x < 0 || this.x > width) this.velX *= -1;
    if (this.y < 0 || this.y > height) this.velY *= -1;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, Math.PI * 2);
    context.fill();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle(Math.random() * width, Math.random() * height));
}

function connectParticles() {
  particles.forEach((particle, index) => {
    for (let i = index + 1; i < particles.length; i++) {
      const dist = Math.hypot(particles[i].x - particle.x, particles[i].y - particle.y);
      if (dist < maxDistance) {
        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,${1 - dist / maxDistance})`;
        context.lineWidth = 1;
        context.moveTo(particle.x, particle.y);
        context.lineTo(particles[i].x, particles[i].y);
        context.stroke();
      }
    }
  });
}

function animate() {
  context.clearRect(0, 0, width, height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

animate();

const ParticleCanvas = () => {
  let animationFrameId;
  const particles = [];
  let ctx, canvas;

  useEffect(() => {
    canvas = document.getElementById('particleCanvas');
    ctx = canvas.getContext('2d');
    initParticles();
    animateParticles();
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas id="particleCanvas" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
  );
};

// Helper function to generate a random number between a min and max
const randomRange = (min, max) => Math.random() * (max - min) + min;

// Particle class
class Particle {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.size = randomRange(1, 3);
    this.color = 'rgba(255, 255, 255,' + randomRange(0.1, 0.9) + ')';
  }
}

// Initialize particles
const initParticles = () => {
  for (let i = 0; i < 100; i++) {
    const x = randomRange(0, canvas.width);
    const y = randomRange(0, canvas.height);
    const velocity = {
      x: randomRange(-2, 2),
      y: randomRange(-2, 2)
    };
    particles.push(new Particle(x, y, velocity));
  }
};

// Draw a particle
const drawParticle = (particle) => {
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};

// Animate particles
const animateParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  for (const particle of particles) {
    drawParticle(particle); // Draw particle
    particle.x += particle.velocity.x; // Update particle position
    particle.y += particle.velocity.y;

    // Reinitialize particles that move off screen
    if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.x > canvas.height) {
      particle.x = randomRange(0, canvas.width);
      particle.y = randomRange(0, canvas.height);
    }
  }
  animationFrameId = requestAnimationFrame(animateParticles);
};
