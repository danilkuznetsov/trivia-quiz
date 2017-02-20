(function(window) {
    'use strict';

    function QuizGame() {
        this.storageEngine = new app.StorageEngine('QuizGame', {
            countAnswer: 0,
            countQuestion: 0
        });
        this.storeService = new app.StoreService(this.storageEngine);
        this.model = new app.Model(this.storeService);
        this.view = new app.View();
        this.controller = new app.Controller(this.model, this.view);
    }

    QuizGame.prototype.loadGame = function() {
        this.controller.loadGame();

    };

    var quizGame = new QuizGame();
    quizGame.loadGame();
})(window);