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
}

MyGame.changePage = function changePage(page) {
    switch (page) {
        case 'page_game':
            {
                MyGame[page].triggerEvent('visibilityChanged');
            }
            break;
        default:
            break;
    }
};

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
            //addEvents();
        };

        var addEvents = function() { // add events to buttons
            $current_page
                .find('input')
                .on('click', inputClicked);
        };

        var registerPageListener = function() { // register and event for the page. Should hide or show the page
            $current_page.on('visibilityChanged', visibilityChanged);
        };

        var visibilityChanged = function() {
            $current_page.toggleClass('active');
        };

        var inputClicked = function(evt) {
            evt.stopPropagation();
            // only the buttons should perform an action
        };

        var triggerEvent = function(event) {
            $current_page.trigger(event);
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
                P.theGamer = player;
                $current_page.removeClass('active');
                P.changePage('page_game');
            }
        };

        return {
            init: init
        };
    })();

})(typeof window.MyGame !== "undefined" ? window.MyGame : {});
