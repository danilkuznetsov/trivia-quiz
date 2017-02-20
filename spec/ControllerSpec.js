describe('controller', function() {
    'use strict';
    var modelMock, viewMock, controller;

    beforeEach(function() {
        modelMock = jasmine.createSpyObj('model', ['incrementCountQuestion', 'incrementCountAnswer', 'readCountQuestion',
            'readCountAnswer', 'getQuestion', 'removeCharInSolution', 'addCharToSolution'
        ]);
        viewMock = jasmine.createSpyObj('view', ['render', 'bind']);

        modelMock.incrementCountAnswer.and.callFake(function(callback) {
            callback({
                countAnswer: 100,
            });
        });

        modelMock.incrementCountQuestion.and.callFake(function(callback) {
            callback({
                countQuestion: 150
            });
        });


        modelMock.getQuestion.and.callFake(function(callback) {
            callback({
                quizId: 100,
                quizCategory: 'QuizCategory',
                quizText: 'QuizText',
                quizAnswer: 'answer',
                quizAnswerByChar: ['a', 'n', 's', 'w', 'e', 'r']
            });
        });

        modelMock.readCountQuestion.and.callFake(function(callback) {
            callback({
                countQuestion: 150
            });
        });

        modelMock.readCountAnswer.and.callFake(function(callback) {
            callback({
                countAnswer: 10
            });
        });

        modelMock.addCharToSolution.and.callFake(function(char, index, callback) {
            callback(char, index, 'correct');
        });

        modelMock.removeCharInSolution.and.callFake(function(char, index, callback) {
            callback(char, index);
        });

        controller = new app.Controller(modelMock, viewMock);
    });

    it('should update count answer and render result to view', function() {
        controller.updateCountAnswer();
        expect(modelMock.incrementCountAnswer).toHaveBeenCalled();
        expect(viewMock.render).toHaveBeenCalledWith('showCountAnswer', 100);
    });

    it('should update count question and render result to view', function() {
        controller.updateCountQuestion();
        expect(modelMock.incrementCountQuestion).toHaveBeenCalled();
        expect(viewMock.render).toHaveBeenCalledWith('showCountQuestion', 150);
    });

    it('should get next question and render result to view', function() {
        controller.getNextQuestion();
        expect(modelMock.getQuestion).toHaveBeenCalled();

        expect(viewMock.render).toHaveBeenCalledWith('showQuestion', {
            quizId: 100,
            quizCategory: 'QuizCategory',
            quizText: 'QuizText',
            quizAnswer: 'answer',
            quizAnswerByChar: ['a', 'n', 's', 'w', 'e', 'r']
        });

    });

    it('should create start screen: get next question, get count answer and quiestion  and render result to view', function() {
        controller.loadGame();

        expect(modelMock.readCountQuestion).toHaveBeenCalled();
        expect(modelMock.readCountAnswer).toHaveBeenCalled();
        expect(modelMock.getQuestion).toHaveBeenCalled();

        expect(viewMock.render).toHaveBeenCalledWith('showCountQuestion', 150);
        expect(viewMock.render).toHaveBeenCalledWith('showCountAnswer', 10);
        expect(viewMock.render).toHaveBeenCalledWith('showQuestion', {
            quizId: 100,
            quizCategory: 'QuizCategory',
            quizText: 'QuizText',
            quizAnswer: 'answer',
            quizAnswerByChar: ['a', 'n', 's', 'w', 'e', 'r']
        });

    });

    it('should add char to solution and  check solution and render correct result to view', function() {
        var char = 'c';
        var index = 0;
        controller.addCharToSolution(char, index);

        expect(modelMock.addCharToSolution).toHaveBeenCalled();

        expect(viewMock.render).toHaveBeenCalledWith('removeCharInClues', {
            char: char,
            index: index
        });

        expect(viewMock.render).toHaveBeenCalledWith('addCharToSolution', {
            char: char,
            index: index
        });

        expect(viewMock.render).toHaveBeenCalledWith('showCorrectMessage');

        expect(modelMock.incrementCountAnswer).toHaveBeenCalled();
        expect(viewMock.render).toHaveBeenCalledWith('showCountAnswer', 100);

    });

    it('should add char to solution and  check solution and render incorrect result to view', function() {
        var char = 'c';
        var index = 0;

        modelMock.addCharToSolution.and.callFake(function(char, index, callback) {
            callback(char, index, 'incorrect');
        });

        controller.addCharToSolution(char, index);

        expect(modelMock.addCharToSolution).toHaveBeenCalled();

        expect(viewMock.render).toHaveBeenCalledWith('removeCharInClues', {
            char: char,
            index: index
        });

        expect(viewMock.render).toHaveBeenCalledWith('addCharToSolution', {
            char: char,
            index: index
        });

        expect(viewMock.render).toHaveBeenCalledWith('showInCorrectMessage');

    });

    it('should remove char to solution and render result to view', function() {
        var char = 'c';
        var index = 0;


        controller.removeCharInSolution(char, index);

        expect(modelMock.removeCharInSolution).toHaveBeenCalled();

        expect(viewMock.render).toHaveBeenCalledWith('removeCharInSolution', {
            char: char,
            index: index
        });

        expect(viewMock.render).toHaveBeenCalledWith('addCharToClues', {
            char: char,
            index: index
        });


    });

});