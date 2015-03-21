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
