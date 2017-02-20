(function(window) {
    'use strict';

    function StoreService(storageEngine) {
        this._storageEngine = storageEngine;
    }

    StoreService.prototype.saveByKey = function(updateKey, updateData, callback) {
        var data = this._storageEngine.read();
        data[updateKey] = updateData;

        this._storageEngine.save(data);

        callback = callback || function() {};
        callback.call(this, data);
    };

    StoreService.prototype.readAll = function(callback) {
        callback = callback || function() {};
        callback.call(this, this._storageEngine.read());
    };

    StoreService.prototype.readByKey = function(key, callback) {

        var data = this._storageEngine.read();

        var result = {};
        result[key] = data[key];

        callback = callback || function() {};
        callback.call(this, result);

        return result;
    };

    StoreService.prototype.getQuestion = function(cbSuccess, cbFail) {

        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    var data = JSON.parse(xhr.responseText);
                    var result = {};
                    var triviaQuiz = data.shift();

                    result.quizId = triviaQuiz.id;
                    result.quizText = triviaQuiz.question;
                    result.quizCategory = triviaQuiz.category.title;
                    // clean up  the answer from atrifacts and replace space to _

                    var answer = triviaQuiz.answer.replace(/<i>|<\/i>|\(|\)|\\|\/|\"|\'/g, '').replace(/\s/g, '_');
                    result.quizAnswer = answer.toLowerCase();

                    cbSuccess = cbSuccess || function() {};
                    cbSuccess.call(this, result);
                } else {
                    cbFail('There was a problem with the ajax request.');
                }
            }
        });

        xhr.open('GET', 'https://jservice.io/api/random', true);
        xhr.send(null);

    };

    // export to window
    window.app = window.app || {};
    window.app.StoreService = StoreService;

})(window);