class GeometryGenerator {
    constructor() {
        this.canvas = document.getElementById('geometryCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.complexity = 6;
        this.currentColor = '#00f3ff';
        
        this.resizeCanvas();
        this.setupEventListeners();
        this.generate();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.getElementById('generateBtn').addEventListener('click', () => this.generate());
        
        document.getElementById('complexity').addEventListener('input', (e) => {
            this.complexity = parseInt(e.target.value);
            this.generate();
        });

        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.color-preset.active').classList.remove('active');
                e.target.classList.add('active');
                this.currentColor = getComputedStyle(e.target).backgroundColor;
                this.generate();
            });
        });
    }

    generate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const patterns = [
            () => this.drawPolygon(),
            () => this.drawGrid(),
            () => this.drawSpiral(),
        ];

        patterns[Math.floor(Math.random() * patterns.length)]();
    }

    drawPolygon() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.complexity; i++) {
            const points = this.complexity + i;
            this.ctx.beginPath();
            for (let j = 0; j <= points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * (radius - (i * 20));
                const y = centerY + Math.sin(angle) * (radius - (i * 20));
                if (j === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    drawGrid() {
        const size = this.canvas.width / this.complexity;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;

        for (let i = 0; i <= this.complexity; i++) {
            for (let j = 0; j <= this.complexity; j++) {
                const x = i * size;
                const y = j * size;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
    }

    drawSpiral() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < 360 * this.complexity; i++) {
            const angle = (i * Math.PI) / 180;
            const radius = (maxRadius * i) / (360 * this.complexity);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
}

// Initialize the generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GeometryGenerator();
}); 