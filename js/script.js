//tablica z opisami ruchow
const moves = [
	'papier', 'kamień', 'nożyce'
];
//wynik meczu
let results = [
	0, //wygrane
	0 //przegrane
];
//do ilu wygranych/przegranych rund gramy
let settingsRounds = 0;

let btnNew = document.getElementsByClassName('btn-new-game')[0];
btnNew.addEventListener('click', function(event) {
	event.preventDefault();
	newGame(); //nowa gra
});
let btnRock = document.getElementsByClassName('btn-play-rock')[0];
btnRock.addEventListener('click', function(event) {
	playerMove(2);
});
let btnPaper = document.getElementsByClassName('btn-play-paper')[0];
btnPaper.addEventListener('click', function(event) {
	playerMove(1);
});
let btnScissors = document.getElementsByClassName('btn-play-scissors')[0];
btnScissors.addEventListener('click', function(event) {
	playerMove(3);
});

//funkcja tworzy nowa gre
let newGame = function() {
	settingsRounds = prompt("Ile rund w meczu?");
	//walidacja
	if(isNaN(settingsRounds) || settingsRounds == '' || settingsRounds <= 0) {
		alert('Nieprawidłowa liczba');
		newGame();
	}

	//wlaczenie buttonow gry
	document.querySelector('.interface').style.display = 'block';
	//zapisanie rund na ekranie
	document.querySelector('.settings-rounds').innerHTML = settingsRounds;
}

//funkcja wykonuje ruchy w rundzie i wyswietla jej wynik
let playerMove = function(move) {
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
			results[0]++;
		} else {
			result = 'Przegrana!!!';
			//zapisanie wyniku meczu
			results[1]++;
		}
	}
	//tekst wyniku
	result += ': zagrałeś ' + moves[move -1].toUpperCase() +
		', komputer zagrał ' + moves[compMove -1].toUpperCase();

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
	document.querySelector('#result .won .value').innerHTML = results[0];
	document.querySelector('#result .lost .value').innerHTML = results[1];
	//zapisanie rund na ekranie
	document.querySelector('.settings-rounds').innerHTML = settingsRounds;
	//czy koniec meczu
	if(results[0] >= settingsRounds || results[1] >= settingsRounds) {
		//koncowy komunikat
		if(results[0] > results[1]) {
			document.getElementById('output').innerHTML += "<br><br>Koniec meczu!!!<br><br>Wygrana!!! Gratulacje!!!";
		} else {
			document.getElementById('output').innerHTML += "<br><br>Koniec meczu!!!<br><br>Przegrana!!! Następnym razem będzie lepiej";
		}
		//wylaczenie buttonow gry
		document.querySelector('.interface').style.display = 'none';
	}
}
