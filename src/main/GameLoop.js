/**
 * Calculates how long a frame should last, given a frame rate (fps)
 * @param fps
 * @return {number} seconds
 */
import * as R from 'ramda';

const getFrameDuration = fps => 1.0 / fps;

/**
 * Calculates how long a frame should last, given a frame rate (fps)
 * @param fps
 * @return {number} millis
 */
const getFrameDurationMillis = fps => 1000.0 / fps;

export default class GameLoop {
    running = false;

    constructor(fps, fn, frameRateListener) {
        this.frameRateListener = frameRateListener;
        this.init(fps, fn);
    }

    init(fps, fn) {
        const frameDurationMillis = getFrameDurationMillis(fps);
        console.log('game loop init, fps:', fps);
        // TODO inject config
        // const minDtMillis = getFrameDurationMillis(fps) * 0.95;
        // const sleepTimeMillis = 5.0; //getFrameDurationMillis(fps * 2.0);
        const maxDtMillis = getFrameDurationMillis(fps / 5.0);
        let dtMillis = 0, lastTime, sleepStart;
        let sleeping = false;

        // TODO: remove itr after debugging is complete
        let itr = 0;
        const gameLoopConfig = {
            fpsMillis: getFrameDurationMillis(fps),
            // minDtMillis,
            maxDtMillis,
            // sleepTimeMillis
        };
        const configRounded = R.map(Math.round, gameLoopConfig);
        console.table(configRounded);
        const loop = (timeMillis) => {
            itr++;
            if (itr > 1000) {
                this.running = false;
            }
            // (A) stop() called
            if (!this.running) {
                console.log('game loop stopping, because running=false');
                return;
            }

            // (B) dt = delta time, or time since last frame
            if (!lastTime) {
                lastTime = timeMillis;
            }
            dtMillis += timeMillis - lastTime;

            // (C) minimize compensation for dt being too big
            if (dtMillis > maxDtMillis) {
                dtMillis = maxDtMillis;
            }

            // (D) process per fps dt increment
            while (dtMillis > frameDurationMillis) {
                dtMillis -= frameDurationMillis;
                // run the main function that we're wrapping in the loop (fn)
                // TODO: may want to separate update() from draw(), ie update() in this loop, and draw() outside? but only if we update() AT LEAST ONCE
                fn(dtMillis / 1000.0);
                if (typeof this.frameRateListener === 'function') {
                    this.frameRateListener(monitorFps(timeMillis));
                }
            }

            lastTime = timeMillis;
            // calls loop() via setTimeout and requestAnimationFrame
            this.enqueue(getFrameDurationMillis(fps * 2.0));
        };
        this.loop = loop.bind(this);
    }

    /**
     *
     * @param timeout millis
     */
    enqueue(timeout) {
        setTimeout(() =>
            requestAnimationFrame(this.loop),
            timeout);
    }

    start() {
        console.log('game loop start');
        this.running = true;
        this.enqueue(0);
    }

    stop() {
        console.log('game loop stop');
        this.running = false;
    }
}

// TODO: export to FPS Monitor class/module
// TODO: add a RESET function
let frames = 0, actualFps = 0, lastCalcTime;
const monitorFps = (timeMillis) => {
    frames++;
    if (!lastCalcTime) {
        lastCalcTime = timeMillis;
    }
    if (timeMillis > lastCalcTime + 1000.0) {
        const dtSec = (timeMillis - lastCalcTime) / 1000.0;
        actualFps = Math.round(frames / dtSec);
        // console.log('fps: ', actualFps);
        frames = 0;
        lastCalcTime = timeMillis;
    }

    return actualFps;
};