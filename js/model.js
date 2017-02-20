(function(window) {
    'use strict';

    function Model(storeService) {
        this._storeService = storeService;
        this._correctAnswer = '';
        this._solution = [];
    }

    Model.prototype.incrementCountAnswer = function(callback) {
        var objCountQuestion = this._storeService.readByKey('countAnswer');
        var count = objCountQuestion.countAnswer;
        count++;
        this._storeService.saveByKey('countAnswer', count, callback);
    };

    Model.prototype.incrementCountQuestion = function(callback) {
        var objCountQuestion = this._storeService.readByKey('countQuestion');
        var count = objCountQuestion.countQuestion;
        count++;
        this._storeService.saveByKey('countQuestion', count, callback);
    };

    Model.prototype.readCountQuestion = function(callback) {
        this._storeService.readByKey('countQuestion', callback);
    };

    Model.prototype.readCountAnswer = function(callback) {
        this._storeService.readByKey('countAnswer', callback);
    };

    Model.prototype.getQuestion = function(cbSuccess, cbFail) {
        var self = this;
        self._storeService.getQuestion(function(receivedQuestion) {
            self._correctAnswer = receivedQuestion.quizAnswer;
            self._solution = [];

            receivedQuestion.quizAnswerByChar = self._storeService.strToRandomArraySymbols(self._correctAnswer);
            cbSuccess.call(this, receivedQuestion);
        }, cbFail);
    };

    Model.prototype.addCharToSolution = function(char, index, callback) {
        var self = this;
        self._solution.push({
            char: char,
            index: index
        });

        var result = this.checkSolution();
        callback = callback || function() {};
        callback.call(this, char, index, result);
    };

    Model.prototype.removeCharInSolution = function(char, index, callback) {
        var self = this;
        var delIndex = self._solution.find(function(element) {
            return element.char === char && element.index === index;
        });
        self._solution.splice(delIndex, 1);
        callback = callback || function() {};
        callback.call(this, char, index);
    };

    Model.prototype.getSolution = function() {
        return this._solution;
    };

    Model.prototype.checkSolution = function() {
        var self = this;

        if (self._solution.length < self._correctAnswer.length) {
            return 'incomplete';
        }

        var solution = self._solution
            .map(function(element) {
                return element.char;
            })
            .join('');

        return self._correctAnswer === solution ? 'correct' : 'incorrect';
    };

    // export to window
    window.app = window.app || {};
    window.app.Model = Model;
})(window);