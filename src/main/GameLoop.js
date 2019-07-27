import * as R from 'ramda';

export default class GameLoop {
    running = false;

    constructor({fps, fn, frameRateListener, maxDtMillis}) {
        this.init({
            fps,
            fn,
            frameRateListener,
            maxDtMillis: maxDtMillis || getFrameMillis(fps) * 5.0
        });
    }

    /**
     * // TODO: remove itr after debugging is complete
     *
     * @param fps
     * @param fn
     * @param frameRateListener
     * @param maxDtMillis Used to clamp dtMillis to a maximum value
     */
    init({fps, fn, frameRateListener, maxDtMillis}) {
        const frameMillis = getFrameMillis(fps);
        console.log('game loop init, fps:', fps);

        let dtMillis = 0;
        let lastTime;
        let itr = 0;

        logConfigValues({fps, maxDtMillis});

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
                if (typeof frameRateListener === 'function') {
                    frameRateListener(monitorFps(timeMillis));
                }
            }

            lastTime = timeMillis;
            // calls loop() via setTimeout and requestAnimationFrame
            this.enqueue(this.loop, getFrameMillis(fps * 2.0));
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
