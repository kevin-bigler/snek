import Controller from '../main/Controller';

describe('Controller', () => {
    it('#addListener happy path', () => {
        let controller = new Controller({});
        expect(controller.keySubs.UP).toEqual([]);
        expect(controller.keySubs.DOWN).toEqual([]);
        const listener1 = () => {};
        controller.addListener(listener1, 'UP');
        expect(controller.keySubs.UP).toEqual([listener1]);
        const listener2 = () => {};
        const listener3 = () => {};
        controller.addListener(listener2, ['UP', 'DOWN']);
        expect(controller.keySubs.UP).toEqual([listener1, listener2]);
        expect(controller.keySubs.DOWN).toEqual([listener2]);
    });
});