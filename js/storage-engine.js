(function(window) {
    'use strict';

    function StorageEngine(name, initData) {
        this._dbName = name;
        if (!localStorage[this._dbName]) {
            localStorage[this._dbName] = JSON.stringify(initData);
        }
    }

    StorageEngine.prototype.read = function() {
   
        return JSON.parse(localStorage[this._dbName]);
    };
    StorageEngine.prototype.save = function(data) {
        localStorage[this._dbName] = JSON.stringify(data);
    };

    // export to window
    window.app = window.app || {};
    window.app.StorageEngine = StorageEngine;

})(window);