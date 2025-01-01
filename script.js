class GeometryGenerator {
    constructor() {
        this.canvas = document.getElementById('geometryCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.complexity = 6;
        this.currentColor = '#00f3ff';
        
        this.resizeCanvas();
        this.setupEventListeners();
        this.isGenerating = false;
        this.currentPattern = 'polygon';
        this.setupPatternSelector();
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

    setupPatternSelector() {
        const selector = document.createElement('select');
        selector.className = 'pattern-selector';
        
        const patterns = {
            'polygon': 'Polygon',
            'grid': 'Grid',
            'spiral': 'Spiral',
            'mandala': 'Mandala',
            'vortex': 'Vortex',
            'starburst': 'Starburst'
        };

        Object.entries(patterns).forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            this.currentPattern = e.target.value;
            this.generate();
        });

        const controls = document.querySelector('.controls');
        controls.insertBefore(selector, controls.firstChild);
    }

    async generate() {
        if (this.isGenerating) return;
        this.isGenerating = true;

        const container = document.querySelector('.canvas-container');
        container.classList.add('generating');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#050507';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const patterns = {
            'polygon': () => this.drawPolygon(),
            'grid': () => this.drawGrid(),
            'spiral': () => this.drawSpiral(),
            'mandala': () => this.drawMandala(),
            'vortex': () => this.drawVortex(),
            'starburst': () => this.drawStarburst()
        };

        await patterns[this.currentPattern]();
        
        container.classList.remove('generating');
        this.isGenerating = false;
    }

    createAnimatedPoint(x, y) {
        const point = document.createElement('div');
        point.className = 'pattern-point';
        point.style.left = `${x}px`;
        point.style.top = `${y}px`;
        document.querySelector('.canvas-container').appendChild(point);
        
        setTimeout(() => point.remove(), 500);
    }

    async drawWithAnimation(x, y) {
        this.createAnimatedPoint(x, y);
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    async drawMandala() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;

        for (let ring = 0; ring < this.complexity; ring++) {
            const petals = (ring + 1) * 8;
            const radius = (maxRadius * (ring + 1)) / this.complexity;

            this.ctx.beginPath();
            for (let i = 0; i <= petals; i++) {
                const angle = (i / petals) * Math.PI * 2;
                const r = radius * (1 + Math.sin(angle * 4) * 0.2);
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;

                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);

                await this.drawWithAnimation(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    async drawVortex() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < 360 * this.complexity; i += 5) {
            const angle = (i * Math.PI) / 180;
            const radius = (maxRadius * i) / (360 * this.complexity);
            const wobble = Math.sin(angle * 8) * 20;
            const x = centerX + Math.cos(angle) * (radius + wobble);
            const y = centerY + Math.sin(angle) * (radius + wobble);
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);

            await this.drawWithAnimation(x, y);
        }
        this.ctx.stroke();
    }

    async drawStarburst() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.complexity * 20; i++) {
            const angle = (i / (this.complexity * 20)) * Math.PI * 2;
            const length = maxRadius * Math.random();
            
            const x1 = centerX + Math.cos(angle) * length * 0.2;
            const y1 = centerY + Math.sin(angle) * length * 0.2;
            const x2 = centerX + Math.cos(angle) * length;
            const y2 = centerY + Math.sin(angle) * length;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            await this.drawWithAnimation(x2, y2);
        }
    }

    async drawPolygon() {
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

                await this.drawWithAnimation(x, y);
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