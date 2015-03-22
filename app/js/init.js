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
