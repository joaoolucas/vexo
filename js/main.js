// Create canvas for moving dots
function createMovingDots() {
    const canvas = document.createElement('canvas');
    
    // Update canvas styles for proper positioning
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.15';
    canvas.style.pointerEvents = 'none'; // Ensure canvas doesn't interfere with clicks
    
    document.body.insertBefore(canvas, document.body.firstChild); // Insert at the beginning of body

    const ctx = canvas.getContext('2d');
    const dots = [];
    const numDots = 200; // Increased number of dots for better visibility
    
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
            radius: Math.random() * 1.5 + 0.5, // Slightly larger dots
            vx: (Math.random() - 0.5) * 0.15, // Slower movement
            vy: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.3 + 0.2 // Increased base opacity
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

// Make sure DOM is loaded before creating canvas
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMovingDots);
} else {
    createMovingDots();
} 