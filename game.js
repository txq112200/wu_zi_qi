class Gomoku {
    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.gameInfo = document.getElementById('game-info');
        this.restartBtn = document.getElementById('restart');
        
        this.boardSize = 15;
        this.cellSize = this.canvas.width / this.boardSize;
        this.pieces = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;

        this.init();
    }

    init() {
        this.drawBoard();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.restartBtn.addEventListener('click', () => this.restart());
    }

    drawBoard() {
        // 绘制棋盘背景
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格线
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.boardSize; i++) {
            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(this.cellSize / 2, i * this.cellSize + this.cellSize / 2);
            this.ctx.lineTo(this.canvas.width - this.cellSize / 2, i * this.cellSize + this.cellSize / 2);
            this.ctx.stroke();

            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize + this.cellSize / 2, this.cellSize / 2);
            this.ctx.lineTo(i * this.cellSize + this.cellSize / 2, this.canvas.height - this.cellSize / 2);
            this.ctx.stroke();
        }

        // 绘制天元和星位
        const stars = [[3, 3], [11, 3], [3, 11], [11, 11], [7, 7]];
        stars.forEach(([x, y]) => {
            this.ctx.beginPath();
            this.ctx.arc(x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        });
    }

    drawPiece(row, col) {
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.4;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        // 创建渐变效果
        const gradient = this.ctx.createRadialGradient(
            x - radius / 3, y - radius / 3, radius / 10,
            x, y, radius
        );

        if (this.pieces[row][col] === 'black') {
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = this.pieces[row][col] === 'black' ? '#000' : '#ccc';
        this.ctx.stroke();
    }

    handleClick(e) {
        if (this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            if (!this.pieces[row][col]) {
                this.pieces[row][col] = this.currentPlayer;
                this.drawPiece(row, col);

                if (this.checkWin(row, col)) {
                    this.gameInfo.textContent = `游戏结束！${this.currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;
                    this.gameOver = true;
                } else {
                    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
                    this.gameInfo.textContent = `当前回合: ${this.currentPlayer === 'black' ? '黑子' : '白子'}`;
                }
            }
        }
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 对角线
            [[1, -1], [-1, 1]]  // 反对角线
        ];

        return directions.some(direction => {
            const count = 1 + this.countPieces(row, col, direction[0][0], direction[0][1]) 
                           + this.countPieces(row, col, direction[1][0], direction[1][1]);
            return count >= 5;
        });
    }

    countPieces(row, col, deltaRow, deltaCol) {
        let count = 0;
        let currentRow = row + deltaRow;
        let currentCol = col + deltaCol;
        const player = this.pieces[row][col];

        while (
            currentRow >= 0 && currentRow < this.boardSize &&
            currentCol >= 0 && currentCol < this.boardSize &&
            this.pieces[currentRow][currentCol] === player
        ) {
            count++;
            currentRow += deltaRow;
            currentCol += deltaCol;
        }

        return count;
    }

    restart() {
        this.pieces = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.gameInfo.textContent = '当前回合: 黑子';
        this.drawBoard();
    }
}

// 启动游戏
new Gomoku();