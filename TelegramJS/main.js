const game = document.getElementById('game');
const result = document.getElementById('result');
const resetBtn = document.getElementById('reset');
const aiPlayer = 'X';
const huPlayer = 'O';
/**
 * Основной класс
 */
class Game {
	/**
	 *
	 * @param {Number} size - длина доски
	 */
	constructor(size = 3) {
		this.size = size
		this.turnCount = 0 // учет кол-ва ходов
		this.huWins = 0 // количество побед человека
		this.aiWins = 0 // количество побед ИИ
		this.loadResults() // загрузить результаты при инициализации

		// сбрасывает текущее состояние игры
		resetBtn.addEventListener('click', () => {
			this.resetGame()
		})

		this.cellList = [] 
		this.resetGame()
	}
	// делаем удобный геттер
	get limit() {
		return this.size * this.size
	}
	// создаем клетки, биндим обработчик нажатия и закидываем в массив
	init() {
		for (let i = 0; i < this.limit; i++) {
			const cell = document.createElement('div')
			cell.setAttribute('data-id', i)
			cell.addEventListener('click', this.humanPlay())
			game.appendChild(cell)
			this.cellList.push(cell)
		}
		this.renderResults() // отображаем результаты
	}
	resetGame() {
		this.board = [...Array(this.limit).keys()]
		result.innerHTML = ''
		game.innerHTML = ''
		this.turnCount = 0
		this.cellList = []
		this.init()
	}
	humanPlay() {
		return e => {
			this.turnCount += 1
			const id = e.target.getAttribute('data-id')
			this.board[+id] = huPlayer
			this.cellList[+id].innerHTML = `<span>${huPlayer}</span>`
			if (this.turnCount >= this.limit) {
				result.innerHTML = '<h4>Ничья!</h4>'
				return
			}
			if (this.checkWinner(this.board, huPlayer)) {
				result.innerHTML = '<h4>Ты победил!</h4>'
				this.huWins++ // увеличиваем количество побед человека
				this.saveResults() // сохраняем результаты
				this.renderResults() // обновляем отображение результатов
				return
			}
			this.makeAiTurn()
		}
	}
	makeAiTurn() {
		this.turnCount += 1
		const bestMove = this.minimax(this.board, aiPlayer)
		this.board[bestMove.idx] = aiPlayer
		this.cellList[bestMove.idx].innerHTML = `<span>${aiPlayer}</span>`
		if (this.turnCount >= this.limit) {
			result.innerHTML = '<h4>Ничья!</h4>'
			return
		}
		if (this.checkWinner(this.board, aiPlayer)) {
			result.innerHTML = '<h4>Бот победил!</h4>'
			this.aiWins++ // увеличиваем количество побед ИИ
			this.saveResults() // сохраняем результаты
			this.renderResults() // обновляем отображение результатов
			return
		}
	}
	checkWinner(board, player) {
		return (
			(board[0] === player && board[1] === player && board[2] === player) ||
			(board[3] === player && board[4] === player && board[5] === player) ||
			(board[6] === player && board[7] === player && board[8] === player) ||
			(board[0] === player && board[3] === player && board[6] === player) ||
			(board[1] === player && board[4] === player && board[7] === player) ||
			(board[2] === player && board[5] === player && board[8] === player) ||
			(board[0] === player && board[4] === player && board[8] === player) ||
			(board[2] === player && board[4] === player && board[6] === player)
		)
	}
	minimax(board, player) {
		const emptyCells = this.findEmptyCells(board)

		if (this.checkWinner(board, huPlayer)) {
			return { score: -1 }
		} else if (this.checkWinner(board, aiPlayer)) {
			return { score: 1 }
		} else if (emptyCells.length === 0) {
			return { score: 0 }
		}
		let moves = []

		for (let i = 0; i < emptyCells.length; i++) {
			let move = {}
			board[emptyCells[i]] = player
			move.idx = emptyCells[i]
			if (player === huPlayer) {
				const payload = this.minimax(board, aiPlayer)
				move.score = payload.score
			} else {
				const payload = this.minimax(board, huPlayer)
				move.score = payload.score
			}
			board[emptyCells[i]] = move.idx
			moves.push(move)
		}
		let bestMove = null

		if (player === aiPlayer) {
			let bestScore = -Infinity
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score
					bestMove = i
				}
			}
		} else {
			let bestScore = Infinity
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score
					bestMove = i
				}
			}
		}

		return moves[bestMove]
	}
	findEmptyCells(board) {
		return board.reduce((acc, curr, index) => {
			if (curr !== huPlayer && curr !== aiPlayer) {
				acc.push(index)
			}
			return acc
		}, [])
	}
	saveResults() {
		localStorage.setItem('huWins', this.huWins)
		localStorage.setItem('aiWins', this.aiWins)
	}
	loadResults() {
		const huWins = localStorage.getItem('huWins')
		const aiWins = localStorage.getItem('aiWins')

		this.huWins = huWins ? parseInt(huWins) : 0
		this.aiWins = aiWins ? parseInt(aiWins) : 0
	}
	renderResults() {
		// Отображаем результаты на экране
		const resultsDiv = document.createElement('div')
		resultsDiv.innerHTML = `
            <p>Победы человека: ${this.huWins}</p>
            <p>Победы ИИ: ${this.aiWins}</p>
        `
		result.appendChild(resultsDiv)
	}
}
// Создание нового экземпляра игры
const gameInstance = new Game()
