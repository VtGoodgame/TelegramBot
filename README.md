Инструкция по использованию. 
Скачать файл с расширением sln  с программной реализацией на с#. 
Открыть проект с помощью Visual Studio  и запустить отладку , проект консольный ,поэтому бот активет пока идет отладка. 
Инструкция использования Бота в Telegram 
Открыть бота, отправить команду /start или сообщение любого содержания.
затем высветится сообщение от бота с предложением использовать команду /play, нажать на высветившуюся кнопку и перейти на web-сайт для прохождения игры. 

Реализация сохранения 
Метод saveResults():

Этот метод отвечает за сохранение текущих результатов (количества побед игрока и ИИ) в локальное хранилище браузера.
Используются методы setItem для записи значений в localStorage
saveResults() {
    localStorage.setItem('huWins', this.huWins);
    localStorage.setItem('aiWins', this.aiWins);
}
Метод loadResults():

Этот метод загружает сохраненные результаты из локального хранилища при инициализации игры.
Используются методы getItem для получения значений из localStorage.
loadResults() {
    const huWins = localStorage.getItem('huWins');
    const aiWins = localStorage.getItem('aiWins');

    this.huWins = huWins ? parseInt(huWins) : 0;
    this.aiWins = aiWins ? parseInt(aiWins) : 0;
}
Здесь происходит проверка на наличие сохраненных данных. Если данные существуют, они преобразуются в целое число с помощью parseInt. Если данных нет, устанавливаются значения по умолчанию (0).

в методе 
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
проверяем кто победил , вследствии прибавляем количество побед на 1 для человека, схожая реализация в методе бота
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

