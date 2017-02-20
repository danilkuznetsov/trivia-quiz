(function(window) {
    'use strict';

    function View() {
        this.countQuestion = qs('.count-question');
        this.countAnswer = qs('.count-answer');

        this.solution = qs('.solution');
        this.clues = qs('.clues');


        this.quizId = qs('.quiz-id');
        this.quizCategory = qs('.quiz-category');
        this.quizText = qs('.quiz-question');


        this.btnSkipQuiz = qs('.button-skip-quiz');
        this.btnNextQuiz = qs('.button-next-quiz');

        this.solutionStatus = qs('.answer-status');

    }

    View.prototype.render = function(command, param) {
        var self = this;
        var viewCommands = {
            showCountAnswer: function() {
                self.countAnswer.textContent = 'Correct answers:' + param;
            },

            showCountQuestion: function() {
                self.countQuestion.textContent = 'Total Questions:' + param;
            },
            showQuestion: function() {
                // reset 
                self.solution.innerHTML = "";
                self.clues.innerHTML = "";
                self.btnNextQuiz.className = 'button-next-quiz button-next-quiz--hidden';
                self.solutionStatus.className = 'answer-status answer-status-correct answer-status-hidden u-text-center';

                self.quizId.textContent = 'Question ID : ' + param.quizId;
                self.quizCategory.textContent = 'Question Category : ' + param.quizCategory;
                self.quizText.textContent = param.quizText;

                // draw clue char
                param.quizAnswerByChar
                    .map(self.buildClueCharacter)
                    .forEach(function(node) {
                        self.clues.appendChild(node);
                    });
            },
            addCharToSolution: function() {
                var node = self.buildClueCharacter(param.char, param.index);
                self.solution.appendChild(node);
            },
            addCharToClues: function() {
                var node = self.buildClueCharacter(param.char, param.index);
                self.clues.appendChild(node);
            },
            removeCharInSolution: function() {
                var node = qs('[data-index="' + param.index + '"]');
                if (node) {
                    self.solution.removeChild(node.parentNode);
                }
            },
            removeCharInClues: function() {
                var node = qs('[data-index="' + param.index + '"]');
                if (node) {
                    self.clues.removeChild(node.parentNode);
                }
            },
            showCorrectMessage: function() {
                self.btnNextQuiz.className = 'button-next-quiz';
                self.solutionStatus.className = 'answer-status answer-status-correct u-text-center';
                self.solutionStatus.textContent = 'Correct';
            },
            showInCorrectMessage: function() {
                self.solutionStatus.className = 'answer-status answer-status-incorrect u-text-center';
                self.solutionStatus.textContent = 'InCorrect';
            }
        };
        viewCommands[command]();
    };

    View.prototype.buildClueCharacter = function(char, index) {
        var node = document.createElement('li');
        node.innerHTML = '<button data-char="' + char + '" data-index="' + index + '">' + char + '</button>';
        return node;
    };

    View.prototype.bind = function(event, handler) {
        var self = this;
        if (event === 'nextQuiz') {
            $on(self.btnNextQuiz, 'click', function() {
                handler(self.countQuestion.textContent);
            });
        } else if (event === 'skipQuiz') {
            $on(self.btnSkipQuiz, 'click', function() {
                handler(self.countAnswer.textContent);
            });
        } else if (event === 'addClueToSolution') {
            $delegate(self.clues, 'button', 'click', function(event) {
                handler(event.target.dataset.char, event.target.dataset.index);
            });

        } else if (event === 'removeClueInSolution') {
            $delegate(self.solution, 'button', 'click', function(event) {
                handler(event.target.dataset.char, event.target.dataset.index);
            });
        }

    };

    // export to window
    window.app = window.app || {};
    window.app.View = View;
})(window);