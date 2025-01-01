// Create canvas for moving dots
function createMovingDots() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.08';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dots = [];
    const numDots = 150; // Increased number of dots
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create dots with varying sizes
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.3, // Smaller dots
            vx: (Math.random() - 0.5) * 0.2, // Slower movement
            vy: (Math.random() - 0.5) * 0.2,
            alpha: Math.random() * 0.4 + 0.1 // More subtle opacity
        });
    }

    // Animate dots
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            // Move dot
            dot.x += dot.vx;
            dot.y += dot.vy;

            // Wrap around screen
            if (dot.x < 0) dot.x = canvas.width;
            if (dot.x > canvas.width) dot.x = 0;
            if (dot.y < 0) dot.y = canvas.height;
            if (dot.y > canvas.height) dot.y = 0;

            // Draw dot with varying opacity
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createMovingDots); 