//konfiguracja i dane meczu
let params = {
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
	]
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

//funkcja tworzy nowa gre
let newGame = function() {
	params.settingsRounds = prompt("Ile rund w meczu?");
	//walidacja
	if(isNaN(params.settingsRounds) || params.settingsRounds == '' || params.settingsRounds <= 0) {
		alert('Nieprawidłowa liczba');
		newGame();
	}

	//wlaczenie buttonow gry
	document.querySelector('.interface').style.display = 'block';
	//zapisanie rund na ekranie
	document.querySelector('.settings-rounds').innerHTML = params.settingsRounds;
}

//funkcja wykonuje ruchy w rundzie i wyswietla jej wynik
let playerMove = function(move) {
	//przypisanie do wykonanego ruchu odpowiedniego numeru
	move = params.moves.indexOf(move) + 1;

	//ruch komputera
	let compMove = randomMove();

	//sprawdzenie wygranej
	let result = 'Remis';
	if(move != compMove) {
		if(move == 1 && compMove == 2 ||
			move == 2 && compMove == 3 ||
			move == 3 && compMove == 1) {

			result = 'Wygrana!!!';
			//zapisanie wyniku meczu
			params.results[0]++;
		} else {
			result = 'Przegrana!!!';
			//zapisanie wyniku meczu
			params.results[1]++;
		}
	}
	//tekst wyniku
	result += ': zagrałeś ' + params.moves[move -1].toUpperCase() +
		', komputer zagrał ' + params.moves[compMove -1].toUpperCase();

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
			document.getElementById('output').innerHTML += "<br><br>Koniec meczu!!!<br><br>Wygrana!!! Gratulacje!!!";
		} else {
			document.getElementById('output').innerHTML += "<br><br>Koniec meczu!!!<br><br>Przegrana!!! Następnym razem będzie lepiej";
		}
		//wylaczenie buttonow gry
		document.querySelector('.interface').style.display = 'none';
	}
}
