import * as R from 'ramda';
import FpsCalculator from './util/FpsCalculator';

export default class GameLoop {
    running = false;

    /**
     * DI constructor
     *
     * @param {number} fps Frames per second configuration value
     * @param {Function} fn The main function to be ran in the loop
     * @param {Function} onFpsUpdate Listener function, invoked upon each new fps calculation
     * @param [maxDtMillis] Optional. Used to clamp dtMillis to a maximum value. Defaults to 5x normal frame duration (from fps)
     */
    constructor({fps, fn, onFpsUpdate, maxDtMillis}) {
        this.onFpsUpdate = onFpsUpdate;
        this.init({
            fps,
            fn,
            maxDtMillis: maxDtMillis || getFrameMillis(fps) * 5.0
        });
    }

    /**
     * // TODO: remove itr variable, after debugging is complete (or build a switch to turn it off/on)
     *
     * @param fps
     * @param fn
     * @param maxDtMillis Used to clamp dtMillis to a maximum value
     */
    init({fps, fn, maxDtMillis}) {
        const frameMillis = getFrameMillis(fps);
        console.log('game loop init, fps:', fps);

        let dtMillis = 0;
        let lastTime;
        let itr = 0;

        logConfigValues({fps, maxDtMillis});

        const fpsCalculator = new FpsCalculator();

        const loop = (timeMillis) => {
            if (++itr > 1000) {
                this.running = false;
            }

            if (!this.running) {
                console.log('game loop stopping, because running=false');
                return;
            }

            if (!lastTime) {
                lastTime = timeMillis;
            }

            dtMillis += timeMillis - lastTime;

            if (dtMillis > maxDtMillis) {
                dtMillis = maxDtMillis;
            }

            // TODO: I think a better approach instead of while etc here is to calc the # iterations, and loop that many times explicitly
            while (dtMillis > frameMillis) {
                dtMillis -= frameMillis;
                // run the main function that we're wrapping in the loop (fn)
                // TODO: may want to separate update() from draw(), ie update() in this loop, and draw() outside? but only if we update() AT LEAST ONCE
                fn(dtMillis / 1000.0);
                this.recordFpsUpdate(timeMillis, fpsCalculator);
            }

            lastTime = timeMillis;
            // calls loop() via setTimeout and requestAnimationFrame
            this.enqueue(this.loop, frameMillis / 2.0); // TODO: wtf is this value? lol. probably want to use `frameMillis / 2.0` here or something
        };
        this.loop = loop.bind(this);
    }

    /**
     * @param fn
     * @param timeout millis
     */
    enqueue(fn, timeout) {
        setTimeout(() =>
            requestAnimationFrame(fn),
            timeout);
    }

    start() {
        console.log('game loop start');
        this.running = true;
        this.enqueue(this.loop, 0);
    }

    stop() {
        console.log('game loop stop');
        this.running = false;
    }

    recordFpsUpdate(timeMillis, fpsCalculator) {
        if (typeof this.onFpsUpdate === 'function') {
            const currentFps = fpsCalculator.recalculateFps(timeMillis);
            this.onFpsUpdate(currentFps);
        }
    }
}

/**
 * logs numeric values, rounded, named
 *
 * @param {Object} vals key-value named config values (numbers)
 */
const logConfigValues = (vals) => {
    const roundedValues = R.map(Math.round, vals);
    console.table(roundedValues);
};

/**
 * Calculates how long a frame should last, given a frame rate (fps)
 * @param {number} fps
 * @return {number} millis
 */
const getFrameMillis = fps => 1000.0 / fps;
