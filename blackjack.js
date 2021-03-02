/*Blackjack functionality */
// Standard Deck
const gameDeck = ['hA','h2','h3','h4','h5','h6','h7','h8','h9','hX','hJ','hQ','hK','dA','d2','d3','d4','d5','d6','d7','d8','d9','dX','dJ','dQ','dK','cA','c2','c3','c4','c5','c6','c7','c8','c9','cX','cJ','cQ','cK','sA','s2','s3','s4','s5','s6','s7','s8','s9','sX','sJ','sQ','sK'];

// Game variables
let cardIndex = 52;
let playerCount = 0;
let playerCards = [];
let houseCount = 0;
let houseCards = [];
let playerCash = 100;
//DOM variables
const playerHand = document.getElementById('playerHand');
const playerBoardCount = document.getElementById('playerCount');
const houseHand = document.getElementById('houseHand');
const houseBoardCount = document.getElementById('houseCount');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const playerBank = document.getElementById('playerBank');
//const deckShuffler = document.getElementById('deckShuffler');

// Game Starts with action btns disabled
hitBtn.disabled = true;
standBtn.disabled = true;

// Shuffle the Deck
function shuffleDeck() {
    gameDeck.sort(() => Math.random() - 0.5);
    cardIndex = 0;
    console.log('Deck is shuffled.');
    // deckShuffler.classList.remove('hidden');
    // setTimeout(function(){
    //     gameDeck = cardDeck.sort(() => Math.random() - 0.5);
    //     deckShuffler.classList.add('hidden');
    // },
    // 3000
    // );
}

//Start a New Game
function startNewGame() {
    if(cardIndex == 52) {
        shuffleDeck();
    }
    while (playerHand.firstChild) {
        playerHand.removeChild(playerHand.firstChild);
    }
    while (houseHand.firstChild) {
        houseHand.removeChild(houseHand.firstChild);
    }
    playerBoardCount.classList.remove('bust');
    playerBoardCount.classList.remove('black-jack');
    houseBoardCount.classList.remove('bust');
    houseBoardCount.classList.remove('black-jack');
    playerBoardCount.textContent = '';
    houseBoardCount.textContent = '';
    playerCount = 0;
    playerCards = [];
    houseCount = 0;
    houseCards = [];
    setTimeout(function(){ drawPlayerCard(); }, 500);
    setTimeout(function(){ drawHouseCard(); }, 1500);
    setTimeout(function(){ drawPlayerCard(); }, 2500);
    setTimeout(function(){ drawHouseCard(true); }, 3500);
    setTimeout(function(){
        hitBtn.disabled = false;
        standBtn.disabled = false;
    }, 3500);
}

// Game End Function
function gameEnd() {
    if(houseCount > 21 || (playerCount == 21 && houseCount != 21) || (playerCount < 21 && playerCount > houseCount)) {
        playerCash += 10;
        houseBoardCount.textContent = 'House lost and gives you money!';
        houseBoardCount.classList.add('bust');
    } else if (houseCount == playerCount) {
        houseBoardCount.textContent = 'House tied with you. No one wins.';
    } else {
        houseBoardCount.textContent = 'House wins and takes your money.';
        houseBoardCount.classList.add('black-jack');
        playerCash -= 10;
    }
    playerBank.textContent = "$" + playerCash;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

// Run after Stand
function onStand() {
    document.querySelector('.house-hidden').classList.remove('house-hidden');
    standBtn.disabled = true;
    houseCards.push('Stand');
    while (houseCount <= 16) {
        drawHouseCard();
    }
    gameEnd();
}

// Draw Card Functions
function drawPlayerCard() {
    if(cardIndex == 52) {
        shuffleDeck();
    }
    let newCard = gameDeck[cardIndex];
    let cardWeight = newCard[1];
    let cardSuit = newCard[0];
    playerCards.push(newCard);
    
    // Build game card html
    let gameCard = document.createElement('div');
    gameCard.innerHTML = '<div class="card-suit"></div>' + cardWeight;
    gameCard.classList.add('game-card');
    // Add suit class to card
    switch (cardSuit) {
    case 'h':
        gameCard.classList.add('hearts');
        break;
    case 'd':
        gameCard.classList.add('diamonds');
        break;
    case 'c':
        gameCard.classList.add('clubs');
        break;
    case 's':
        gameCard.classList.add('spades');
        break;
    }
    // Place card on player board
    playerHand.appendChild(gameCard);

    // Add to Player Count
    if (cardWeight == 'A' && playerCount < 11) {
        playerCount += 11;
        playerCards.push('Eleven');
    } else if (cardWeight == 'A' && playerCount > 10) {
        playerCount += 1;
    } else if(cardWeight == 'X' || cardWeight == 'J' || cardWeight == 'Q' || cardWeight == 'K') {
        playerCount += 10;
    } else {
        playerCount += parseInt(cardWeight);
    }
    checkPlayerCount();
    cardIndex ++;
}

function drawHouseCard(hidden) {
    if(cardIndex == 52) {
        shuffleDeck();
    }
    let newHouseCard = gameDeck[cardIndex];
    let cardHouseWeight = newHouseCard[1];
    let cardHouseSuit = newHouseCard[0];
    houseCards.push(newHouseCard);
    // Build game card html
    let gameHouseCard = document.createElement('div');
    gameHouseCard.innerHTML = '<div class="card-suit"></div>' + cardHouseWeight;
    gameHouseCard.classList.add('game-card');
    if(hidden) {
        gameHouseCard.classList.add('house-hidden');
    }
    // Add suit class to card
    switch (cardHouseSuit) {
    case 'h':
        gameHouseCard.classList.add('hearts');
        break;
    case 'd':
        gameHouseCard.classList.add('diamonds');
        break;
    case 'c':
        gameHouseCard.classList.add('clubs');
        break;
    case 's':
        gameHouseCard.classList.add('spades');
        break;
    }
    // Place card on house board
    houseHand.appendChild(gameHouseCard);

    // Add to House Count
    if (cardHouseWeight == 'A' && houseCount < 11) {
        houseCount += 11;
        houseCards.push('Eleven');
    } else if (cardHouseWeight == 'A' && houseCount > 10) {
        houseCount += 1;
    } else if(cardHouseWeight == 'X' || cardHouseWeight == 'J' || cardHouseWeight == 'Q' || cardHouseWeight == 'K') {
        houseCount += 10;
    } else {
        houseCount += parseInt(cardHouseWeight);
    }
    checkHouseCount();
    cardIndex ++;
}


// Card counters
function checkPlayerCount() {
    playerBoardCount.textContent = '';
    // Check for Aces and reduce to 1, if bust
    if(playerCount > 21 && playerCards.indexOf('Eleven') !== -1) {
        playerCount -= 10;
        playerCards.splice(playerCards.indexOf('Eleven'), 1);
    }
    // General count outcomes
    if (playerCount > 21) {
        playerBoardCount.textContent = `House wins! You busted over 21. Start a New Game?`;
        playerBoardCount.classList.add('bust');
        gameEnd();
    } else if (playerCount == 21) {
        playerBoardCount.textContent = `You hit 21! ...Now let's see what House gets.`;
        playerBoardCount.classList.add('black-jack');
        hitBtn.disabled = true;
        standBtn.disabled = true;
        setTimeout(function(){ onStand(); }, 3000);
    } else {
        playerBoardCount.textContent = `Your current count is ${playerCount}. Hit or Stand?`;
    }
}

function checkHouseCount() {
    houseBoardCount.textContent = '';
    if(houseCards.indexOf("Stand") == -1) {
        houseBoardCount.textContent =  "...House is waiting for you to Stand.";
    } else {
        // Check for Aces and reduce to 1, if bust
        if(houseCount > 21 && houseCards.indexOf('Eleven') !== -1) {
            houseCount -= 10;
            houseCards.splice(playerCards.indexOf('Eleven'), 1);
        }
    }
}