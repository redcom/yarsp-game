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
