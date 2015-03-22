window.MyGame = {}; // start with a namespoace

$(document).ready(initApplication);

function initApplication() {
    "use strict";
    $("div[id^=page]").map(function(id, view) {
        //find out the controller we need to initialize
        var page = view.id,
            isActive = ~view.className.indexOf('active');

        //initialize only the active page
        if (MyGame[page]) {
            if (isActive) {
                MyGame[page].init(view);
            } else {
                MyGame[page].register(view);
            }
        }
    });

    // setting the game as RSP and initialize the engine with a new instance of the game
    MyGame.gameEngine = GameEngine.init('rsp');

    MyGame.changePage = function changePage(page) {
        switch (page) {
            case 'page_game': {
                    MyGame[page].triggerEvent('visibilityChanged');
                }
                break;
            default:
                break;
        }
    };
}

// Module game page
(function(P) {
    "use strict";
    P.page_game = (function() {
        var $current_page;

        var register = function(page) { // register the module.
            init(page);
            registerPageListener();
        };

        var init = function(page) { // initialize the moduule, save reference to dom
            $current_page = $(page);
            addEvents();
        };

        var addEvents = function() { // add events to buttons
            $current_page
                .find('.tools')
                .on('click', toolsClicked);
            $current_page
                .find('>div input[name=changeGame]')
                .on('click', changeGameType);
        };

        var changeGameType = function(evt) {
            evt.stopPropagation();
            if(evt.target.dataset) {
                var gameType = evt.target.dataset.type;
                if (gameType === 'rsp') {
                    cleanUpResults();
                    $current_page
                        .find('ul.tools')
                        .removeClass('rsp');
                    evt.target.dataset.type='rspls';
                    P.gameEngine.init('rspls');
                } else {
                    cleanUpResults();
                    $current_page
                        .find('ul.tools')
                        .addClass('rsp');
                    evt.target.dataset.type='rsp';
                    P.gameEngine.init('rsp');
                }
            }
        };
        var registerPageListener = function() { // register and event for the page. Should hide or show the page
            $current_page.on('visibilityChanged', visibilityChanged);
        };

        var visibilityChanged = function() {
            $current_page.toggleClass('active');
        };

        var toolsClicked = function(evt) {
            evt.stopPropagation();
            // only if clicked on the A element
            if (evt.target.nodeName === "A" && ~evt.target.className.indexOf('tool ')) {
                var tool = event.target.dataset.tool;
                gameStart(tool);
            }
        };

        var triggerEvent = function(event) {
            $current_page.trigger(event);
        };

        var gameStart = function(tool) { // this will get the winer or loser
            cleanUpResults(); // every play alters the view, This will clear it
            showResults(P.gameEngine.getResults(tool)); // show the game results in ui
        };

        var cleanUpResults = function() {
            $current_page
                .find('.scores')
                .find('p.playerChoice')
                .removeClass('red')
                .empty();
            $current_page
                .find('.scores h2')
                .empty();
            $current_page
                .find('.score')
                .text("0");
        };

        var showResults = function(results) {
            var winner = results.winner,
                player = results.player2,
                computer = results.player1,
                gameScore = results.gameScore;

            var resultsBox = $current_page.find('.scores .row>div');

            var $refComputer = $(resultsBox[0]);
            $refComputer
                .find('.playerChoice')
                .html(computer.toUpperCase());
            $refComputer
                .find('.score')
                .html(gameScore.player1);

            var $refPlayer = $(resultsBox[1]);
            $refPlayer.find('.playerChoice')
                .html(player.toUpperCase());
            $refPlayer
                .find('.score')
                .html(gameScore.player2);

            switch (winner) {
                case player:
                    $refComputer
                        .find('.playerChoice')
                        .addClass('red');
                    $current_page
                        .find('.scores h2')
                        .html('You won!');
                    break;
                case computer:
                    $refPlayer
                        .find('.playerChoice')
                        .addClass('red');
                    $current_page
                        .find('.scores h2')
                        .html('Computer won!');
                    break;
                default:
                    $current_page
                        .find('.scores h2')
                        .html('It a tight game!');
                    break;
            }
        };

        return {
            register: register,
            triggerEvent: triggerEvent
        };
    })();

})(typeof window.MyGame !== "undefined" ? window.MyGame : {});

// Module welcome page
(function(P) {
    P.page_welcome = (function() {
        var $current_page;

        var init = function(page) { // initialize the moduule, save reference to dom
            $current_page = $(page);
            addEvents();
        };

        var addEvents = function() { // add events to buttons
            $current_page
                .find('input')
                .on('click', inputClicked);
        };

        var inputClicked = function(evt) {
            evt.stopPropagation();
            // only the buttons should perform an action
            if (evt.target.dataset) {
                var player = evt.target.dataset.player;
                P.gameEngine.setOpponent(player);

                $current_page.removeClass('active');
                P.changePage('page_game');
            }
        };

        return {
            init: init
        };
    })();

})(typeof window.MyGame !== "undefined" ? window.MyGame : {});
