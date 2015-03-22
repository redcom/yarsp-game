/* Simplistic game engine
    Given a typeOfGame ( rsp or rspls) return the winner
*/

// polluting global namespace. ToDo move this into a proper location
var GameEngine = (function() {
    "use strict";
    var tools = [],
        player1 = 'computer',
        player2 = 'human',
        gameScore = { // keep the score game 
            player1: 0,
            player2: 0
        },
        gameType;


    var setOpponent = function(oponent) { // used when the game is between computer and computer
        player2 = oponent;
    };

    var generateRandomTool = function() {
        return Math.floor(Math.random() * tools.length);
    };

    var init = function(typeOfGame) {
        gameType = typeOfGame;
        gameScore = { // reset the game
            player1: 0,
            player2: 0
        };
        if (typeOfGame === 'rsp') { // rsp has only 3 tools to play with
            tools = ['rock', 'paper', 'scissor'];
            /*
             * 0 = rock
             * 1 = paper
             * 2 = scissor
             */
        } else { //rspls has 5 tools
            tools = ['rock', 'spock', 'paper', 'lizard', 'scissor'];
            /*
             * 0 = rock
             * 1 = spock
             * 2 = paper
             * 3 = lizard
             * 4 = scissor
             */
        }
        return this;
    };

    var getResults = function(tool) {
        var player2_choice = tools.indexOf(tool),
            player1_choice = generateRandomTool(),
            toolsLength = tools.length;

        // compute difference between player1_choice and player2_choice modulo tools.length to make it work for 3 tools or for 5
        var difference = ((player2_choice - player1_choice) - (Math.floor((player2_choice - player1_choice) / toolsLength) * toolsLength));


        return interpretResult(difference, player2_choice, player1_choice);
    };

    var interpretResult = function(difference, player2_choice, player1_choice) {
        var winner, winner2;

        if (gameType === 'rsp') {
            winner = (difference === 1) ? tools[player2_choice] : null;
            winner2 = (!winner && difference === 2) ? tools[player1_choice] : null;
        } else {
            winner = (~[1, 2].indexOf(difference)) ? tools[player2_choice] : null;
            winner2 = (!winner && ~[3, 4].indexOf(difference)) ? tools[player1_choice] : null;

        }
        winner = winner || winner2 || 0; // decide what to send back

        gameScore = {
            player1: (winner === tools[player1_choice]) ? ++gameScore.player1 : gameScore.player1,
            player2: (winner === tools[player2_choice]) ? ++gameScore.player2 : gameScore.player2,
        };
        return {
            winner: winner,
            player2: tools[player2_choice],
            player1: tools[player1_choice],
            gameScore: gameScore
        };
    };

    return {
        init: init,
        setOpponent: setOpponent,
        getResults: getResults
    };
})();
