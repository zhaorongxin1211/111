class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-game');
        this.ctx = this.canvas.getContext('2d');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.scoreElement = document.getElementById('score');
        
        this.gridSize = 20;
        this.canvasSize = 400;
        this.cols = this.canvasSize / this.gridSize;
        this.rows = this.canvasSize / this.gridSize;
        
        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameSpeed = 150;
        this.gameInterval = null;
        this.gameRunning = false;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.generateFood();
        this.draw();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.nextDirection = 'right';
                break;
        }
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gameInterval = setInterval(() => this.update(), this.gameSpeed);
            this.startBtn.textContent = '游戏中';
            this.startBtn.disabled = true;
        }
    }
    
    pauseGame() {
        if (this.gameRunning) {
            this.gameRunning = false;
            clearInterval(this.gameInterval);
            this.startBtn.textContent = '继续游戏';
            this.startBtn.disabled = false;
        } else {
            this.startGame();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        clearInterval(this.gameInterval);
        this.init();
        this.startBtn.textContent = '开始游戏';
        this.startBtn.disabled = false;
    }
    
    update() {
        this.direction = this.nextDirection;
        
        const head = { ...this.snake[0] };
        
        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    checkCollision(head) {
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            return true;
        }
        
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameInterval);
        alert(`游戏结束！你的分数是：${this.score}`);
        this.startBtn.textContent = '重新开始';
        this.startBtn.disabled = false;
    }
    
    generateFood() {
        let foodX, foodY;
        let isFoodOnSnake;
        
        do {
            foodX = Math.floor(Math.random() * this.cols);
            foodY = Math.floor(Math.random() * this.rows);
            
            isFoodOnSnake = false;
            for (const segment of this.snake) {
                if (segment.x === foodX && segment.y === foodY) {
                    isFoodOnSnake = true;
                    break;
                }
            }
        } while (isFoodOnSnake);
        
        this.food = { x: foodX, y: foodY };
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSnake();
        this.drawFood();
    }
    
    drawSnake() {
        this.ctx.fillStyle = '#667eea';
        this.ctx.strokeStyle = '#764ba2';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
            this.ctx.strokeRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
        }
        
        const head = this.snake[0];
        this.ctx.fillStyle = '#764ba2';
        this.ctx.fillRect(
            head.x * this.gridSize,
            head.y * this.gridSize,
            this.gridSize,
            this.gridSize
        );
        this.ctx.strokeRect(
            head.x * this.gridSize,
            head.y * this.gridSize,
            this.gridSize,
            this.gridSize
        );
    }
    
    drawFood() {
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x * this.gridSize) + (this.gridSize / 2),
            (this.food.y * this.gridSize) + (this.gridSize / 2),
            this.gridSize / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});