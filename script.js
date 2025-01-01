class VexoGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.activeColor = '#00fff2';
        this.density = 50;
        this.speed = 50;
        this.isAnimating = false;
        this.currentPattern = 'helix';
        
        this.setupCanvas();
        this.setupEventListeners();
        this.generate();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.generate();
        });
    }

    setupEventListeners() {
        document.getElementById('generate').addEventListener('click', () => this.generate());
        document.getElementById('pattern').addEventListener('change', (e) => {
            this.currentPattern = e.target.value;
            this.generate();
        });

        document.getElementById('density').addEventListener('input', (e) => {
            this.density = e.target.value;
            this.generate();
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.speed = e.target.value;
            if (this.isAnimating) this.generate();
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.color-btn.active').classList.remove('active');
                e.target.classList.add('active');
                this.activeColor = e.target.dataset.color;
                this.generate();
            });
        });
    }

    async generate() {
        const overlay = document.querySelector('.loading-overlay');
        overlay.classList.remove('hidden');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#12121f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const patterns = {
            helix: () => this.drawHelix(),
            matrix: () => this.drawMatrix(),
            nexus: () => this.drawNexus(),
            pulse: () => this.drawPulse()
        };

        await patterns[this.currentPattern]();
        overlay.classList.add('hidden');
    }

    async drawHelix() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        this.ctx.strokeStyle = this.activeColor;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < 360 * (this.density / 25); i += 5) {
            const angle = (i * Math.PI) / 180;
            const radius = (maxRadius * i) / (360 * (this.density / 25));
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            await new Promise(r => setTimeout(r, 100 / this.speed));
        }
    }

    async drawMatrix() {
        const size = this.canvas.width / (this.density / 5);
        this.ctx.strokeStyle = this.activeColor;
        this.ctx.lineWidth = 2;

        for (let x = 0; x <= this.canvas.width; x += size) {
            for (let y = 0; y <= this.canvas.height; y += size) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + size/2, y + size/2);
                this.ctx.stroke();
                
                await new Promise(r => setTimeout(r, 50 / this.speed));
            }
        }
    }

    async drawNexus() {
        const points = [];
        const numPoints = this.density / 2;
        
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height
            });
        }

        this.ctx.strokeStyle = this.activeColor;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(points[i].x, points[i].y);
                    this.ctx.lineTo(points[j].x, points[j].y);
                    this.ctx.stroke();
                    
                    await new Promise(r => setTimeout(r, 20 / this.speed));
                }
            }
        }
    }

    async drawPulse() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.activeColor;
        this.ctx.lineWidth = 2;

        for (let radius = 0; radius < maxRadius; radius += maxRadius / (this.density / 2)) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            await new Promise(r => setTimeout(r, 100 / this.speed));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VexoGenerator();
}); 