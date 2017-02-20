describe('store', function() {
    'use strict';
    var storeService, storeEngine, testCallback;


    beforeEach(function() {
        testCallback = jasmine.createSpy("callback");

        storeEngine = jasmine.createSpyObj('storeEngine', ['read', 'save']);
        storeEngine.read.and.returnValue({
            count: 123
        });

        storeService = new app.StoreService(storeEngine);
    });

    it('should save data by key in storage engine', function() {
        storeService.saveByKey('count', 100, testCallback);

        expect(storeEngine.save).toHaveBeenCalledWith({
            count: 100
        });
        expect(testCallback).toHaveBeenCalledWith({
            count: 100
        });
    });

    it('should read all data in storage engine', function() {
        var actualDataObj = storeService.readAll(testCallback);

        expect(storeEngine.read).toHaveBeenCalled();
        expect(testCallback).toHaveBeenCalledWith({
            count: 123
        });
    });

    it('should read data by key in storage engine', function() {
        var actualDataObj = storeService.readByKey('count', testCallback);

        expect(storeEngine.read).toHaveBeenCalled();
        expect(testCallback).toHaveBeenCalledWith({
            count: 123
        });

        expect(actualDataObj).toEqual({
            count: 123
        });
    });
});