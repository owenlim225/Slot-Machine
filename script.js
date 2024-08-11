var isSpinning = false;
var audioEnabled = false;
let statusElement = document.getElementById("status");

// Load sounds
var spinSounds = Array(7).fill().map(() => new Audio("res/sounds/spin.mp3"));
var coinSounds = Array(3).fill().map(() => new Audio("res/sounds/coin.mp3"));
var winSound = new Audio("res/sounds/win.mp3");
var loseSound = new Audio("res/sounds/lose.mp3");

const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

/**
 * @type {number} The minimum spin time in seconds
 */
const BASE_SPINNING_DURATION = 2.7;

/**
 * @type {number} The additional duration to the base duration for each row (in seconds).
 * It makes the typical effect that the first reel ends, then the second, and so on...
 */
const COLUMN_SPINNING_DURATION = 0.3;


var cols;


window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');

    setInitialItems();
});

function setInitialItems() {
    let baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3);
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="res/items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item;
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

/**
 * Called when the start-button is pressed.
 *
 * @param elem The button itself
 */
function spin(elem) {
    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) { 
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    elem.setAttribute('disabled', true);

    document.getElementById('container').classList.add('spinning');

    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }.bind(elem), duration * 1000);
}

function setResult() {
    for (let col of cols) {

        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];

        let icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'res/items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'res/items/' + results[x] + '.png');
        }
    }
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
   @returns {number}
 */
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}


function toggleAudio() {
    audioEnabled = !audioEnabled;
    let volume = audioEnabled ? 0.5 : 0;

    spinSounds.forEach(sound => sound.volume = volume);
    coinSounds.forEach(sound => sound.volume = volume);
    winSound.volume = audioEnabled ? 1.0 : 0;
    loseSound.volume = audioEnabled ? 1.0 : 0;

    document.getElementById("audio").src = `res/icons/audio${audioEnabled ? "On" : "Off"}.png`;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}