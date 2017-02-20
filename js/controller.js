(function(window) {
    'use strict';

    function Controller(model, view) {
        var self = this;
        self.model = model;
        self.view = view;


        self.view.bind('nextQuiz', function() {
            self.getNextQuestion();
        });

        self.view.bind('skipQuiz', function() {
            self.getNextQuestion();
        });


        self.view.bind('addClueToSolution', function(char, index) {
            self.addCharToSolution(char, index);
        });

        self.view.bind('removeClueInSolution', function(char, index) {
            self.removeCharInSolution(char, index);
        });
    }

    Controller.prototype.updateCountQuestion = function() {
        var self = this;
        self.model.incrementCountQuestion(function(data) {
            self.view.render('showCountQuestion', data.countQuestion);
        });
    };

    Controller.prototype.updateCountAnswer = function() {
        var self = this;
        self.model.incrementCountAnswer(function(data) {
            self.view.render('showCountAnswer', data.countAnswer);
        });
    };

    Controller.prototype.getNextQuestion = function() {
        var self = this;
        self.model.getQuestion(function(question) {
            console.log(question.quizAnswer);
            self.view.render('showQuestion', question);
            self.updateCountQuestion();
        }, function(error) {
            console.log(error);
        });
    };

    Controller.prototype.loadGame = function() {
        var self = this;

        self.model.readCountAnswer(function(data) {
            self.view.render('showCountAnswer', data.countAnswer);
        });


        self.model.readCountQuestion(function(data) {
            self.view.render('showCountQuestion', data.countQuestion);
        });

        self.getNextQuestion();
    };

    Controller.prototype.addCharToSolution = function(char, index) {
        var self = this;
        self.model.addCharToSolution(char, index, function(char, index, status) {

            self.view.render('removeCharInClues', {
                char: char,
                index: index
            });
            self.view.render('addCharToSolution', {
                char: char,
                index: index
            });

            if (status === 'correct') {
                self.updateCountAnswer();
                self.view.render('showCorrectMessage');
            } else if (status === 'incorrect') {
                self.view.render('showInCorrectMessage');
            }
        });

    };

    Controller.prototype.removeCharInSolution = function(char, index) {
        var self = this;
        self.model.removeCharInSolution(char, index, function(char, index) {
            self.view.render('removeCharInSolution', {
                char: char,
                index: index
            });
            self.view.render('addCharToClues', {
                char: char,
                index: index
            });
        });
    };

    //export to window
    window.app = window.app || {};
    window.app.Controller = Controller;

})(window);