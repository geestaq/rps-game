//konfiguracja i dane meczu
let params = {
	playerName: "", //nazwa gracza
	//do ilu wygranych/przegranych rund gramy
	settingsRounds: 0,
	//wynik meczu
	results: [
		0, //wygrane
		0 //przegrane
	],
	//tablica z opisami ruchow
	moves: [
		'papier', 'kamień', 'nożyce'
	],
	progress: [],
	currentRound: 0 //aktualna runda
}

//funkcja pomocnicza format - zamienia wstawia tekst w placeholdery
//dzialanie jak string.format w c# - "{0} {1}".format("aaa", "bbb")
if (!String.prototype.format) {
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
}

let btnNew = document.getElementsByClassName('btn-new-game')[0];
btnNew.addEventListener('click', function(event) {
	event.preventDefault();
	newGame(); //nowa gra
});
let moveButtons = document.getElementsByClassName('player-move');
for(let item of moveButtons) {
	//dodanie obslugi buttonow ruchu gracza
	item.addEventListener('click', function(event) {
		playerMove(event.target.getAttribute('data-move'));
	});
}
let btnStart = document.getElementsByClassName('btn-start')[0];
btnStart.addEventListener('click', function(event) {
	event.preventDefault();

	params.settingsRounds = document.getElementById('roundsWinLimit').value;
	params.playerName = document.getElementById('playerName').value.trim();
	//walidacja
	if(params.playerName.length == 0) {
		alert('Podaj nazwę gracza');
		return;
	}
	if(isNaN(params.settingsRounds) || params.settingsRounds == '' || params.settingsRounds <= 0) {
		alert('Nieprawidłowa liczba rund');
		return;
	}

	hideModal(null);

	//wlaczenie buttonow gry
	document.querySelector('.interface').style.display = 'block';
	//zapisanie rund na ekranie
	document.querySelector('.settings-rounds').innerHTML = params.settingsRounds
	//reset aktualnej rundy
	params.currentRound = 0;
	//reset progresu
	params.progress = [];
	//reset wyniku
	params.results = [0,0];
	displayResult('');
});

//funkcja tworzy nowa gre
let newGame = function() {
	showModal('#modal-new-game-params');
};

//funkcja wykonuje ruchy w rundzie i wyswietla jej wynik
let playerMove = function(move) {
	//nowa runda
	params.currentRound++;
	//przypisanie do wykonanego ruchu odpowiedniego numeru
	move = params.moves.indexOf(move) + 1;
	//przebieg rundy
	let progress = {};

	//ruch komputera
	let compMove = randomMove();

	//sprawdzenie wygranej
	let result = 'Remis: ' + params.playerName;
	progress.result = 'Remis';
	if(move != compMove) {
		if(move == 1 && compMove == 2 ||
			move == 2 && compMove == 3 ||
			move == 3 && compMove == 1) {

			result = 'Wygrana!!!: ' + params.playerName;
			//zapisanie wyniku meczu
			params.results[0]++;

			progress.result = "Wygrana";
		} else {
			result = 'Przegrana!!!: ' + params.playerName;
			//zapisanie wyniku meczu
			params.results[1]++;

			progress.result = "Przegrana";
		}
	}
	//tekst wyniku
	result += ' zagrałeś ' + params.moves[move -1].toUpperCase() +
		', komputer zagrał ' + params.moves[compMove -1].toUpperCase();

	//zapisanie progresu
	progress.roundNo = params.currentRound;
	progress.playerMove = move;
	progress.compMove = compMove;
	progress.score = params.results[0] + '-' + params.results[1];
	params.progress.push(progress);

	//wyswietlenie wyniku
	displayResult(result);
};

//funkcja zwraca losowy ruch
//1 - Papier
//2 - Kamień
//3 - Nożyce
let randomMove = function() {
	return Math.floor((Math.random() * 3) + 1);
}

//funkcja wyswietla wynik rundy
let displayResult = function(text) {
	//komunikat
	document.getElementById('output').innerHTML = text;
	//wynik meczu
	document.querySelector('#result .won .value').innerHTML = params.results[0];
	document.querySelector('#result .lost .value').innerHTML = params.results[1];
	//zapisanie rund na ekranie
	document.querySelector('.settings-rounds').innerHTML = params.settingsRounds;
	//czy koniec meczu
	if(params.results[0] >= params.settingsRounds || params.results[1] >= params.settingsRounds) {
		//koncowy komunikat
		if(params.results[0] > params.results[1]) {
			document.querySelector('#modal-result .content').innerHTML = "Koniec meczu!!!<br><br>Wygrana!!! Gratulacje!!!";
		} else {
			document.querySelector('#modal-result .content').innerHTML = "Koniec meczu!!!<br><br>Przegrana!!! Następnym razem będzie lepiej";
		}
		//generowanie tabeli z przebiegiem gry
		document.querySelector('#modal-result header').innerHTML = "Wyniki";
		let table = '<table border="1" cellspacing="0" cellpadding="3"><tr><th>Runda</th><th>Gracz</th><th>Komputer</th><th>Wynik</th><th>Punktacja</th></tr>';
		params.progress.forEach(function(item) {
			table += '<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>'.format(
				item.roundNo,
				params.moves[item.playerMove-1],
				params.moves[item.compMove-1],
				item.result,
				item.score
			);
		});
		table += '</table>';
		document.querySelector('#modal-result .progress').innerHTML = table;
		showModal('#modal-result');

		//wylaczenie buttonow gry
		document.querySelector('.interface').style.display = 'none';
	}
}

//funkcja wyswietla modal
let showModal = function(id){
    //usuniecie klasy show ze wszystkich modali
    let modals = document.querySelectorAll('.modal');
    modals.forEach(function(item){
      item.classList.remove('show');
    });

	//dodanie klasy show do odpowiedniego modala
	document.querySelector(id).classList.add('show');

	document.querySelector('#modal-overlay').classList.add('show');

};

//funkcja ukrywa modal
let hideModal = function(event){
	if(event !== null) event.preventDefault();
	document.querySelector('#modal-overlay').classList.remove('show');
};
//przyciski do zamykania modala
let closeButtons = document.querySelectorAll('.close');
for(var i = 0; i < closeButtons.length; i++){
	closeButtons[i].addEventListener('click', hideModal);
}
//klikniecie overlay zamyka modal
document.querySelector('#modal-overlay').addEventListener('click', hideModal);
//klikanie w modal nie zamyka go
let modals = document.querySelectorAll('.modal');
for(var i = 0; i < modals.length; i++){
	modals[i].addEventListener('click', function(event){
		event.stopPropagation();
	});
}

//showModal('#modal-');
