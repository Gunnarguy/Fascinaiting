document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById("headerDropdown");
    const dropdownContent = document.getElementById("headerDropdownContent");
    const canvas = document.getElementById('networkCanvas');
    const context = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];
    const numParticles = 300;
    const maxDistance = 50;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.velX = (Math.random() - 1) * 1;
            this.velY = (Math.random() - 1) * 1;
        }

        update() {
            this.x += this.velX;
            this.y += this.velY;
            if (this.x < 0 || this.x > width) this.velX *= -1;
            if (this.y < 0 || this.y > height) this.velY *= -1;
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, 1, 1, Math.PI * 2);
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
                    context.strokeStyle = `rgba(0, 51, 102, ${1 - dist / maxDistance})`;
                    context.lineWidth = .75;
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

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    dropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        dropdownContent.classList.toggle("hidden");
    });

    window.addEventListener("click", function(event) {
        if (!event.target.matches("#headerDropdown")) {
            if (!dropdownContent.classList.contains("hidden")) {
                dropdownContent.classList.add("hidden");
            }
        }
    });

    animate();
});
