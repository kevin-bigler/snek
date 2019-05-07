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

    constructor(fps, fn) {
        this.init(fps, fn);
    }

    init(fps, fn) {
        console.log('game loop init, fps:', fps);
        // TODO inject config
        const minDtMillis = getFrameDurationMillis(fps) * 0.95;
        const maxDtMillis = getFrameDurationMillis(fps / 5.0);
        const sleepTimeMillis = 5.0; //getFrameDurationMillis(fps * 2.0);
        let dtMillis, lastTime, sleepStart;
        let sleeping = false;

        // TODO: remove itr after debugging is complete
        let itr = 0;
        const gameLoopConfig = {
            fpsMillis: getFrameDurationMillis(fps),
            minDtMillis,
            maxDtMillis,
            sleepTimeMillis
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
            dtMillis = timeMillis - lastTime;
            console.log('game loop iteration - dt=', dtMillis, 'ms');

            // (C) minimize compensation for dt being too big
            if (dtMillis > maxDtMillis) {
                dtMillis = maxDtMillis;
            }

            // (D) don't overexert (minimize processes/sec)
            if (dtMillis < minDtMillis) {
                console.log('sleeping for', sleepTimeMillis, ' - dt=', dtMillis, 'ms, min dt=', minDtMillis, 'ms');
                this.enqueue(sleepTimeMillis);
                return;
            }

            // run the main function that we're wrapping in the loop (fn)
            console.log('RUN MAIN FN, dt=', Math.round(dtMillis), 'ms, actual dt=', Math.round(timeMillis - lastTime), 'ms');
            fn(dtMillis / 1000.0);
            monitorFps(timeMillis, dtMillis);
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
let frames = 0, actualFps = 0, lastCalcTime, lastTime;
const monitorFps = (timeMillis, dtMillis) => {
    frames++;
    if (!lastCalcTime) {
        lastCalcTime = timeMillis;
    }
    if (timeMillis > lastCalcTime + 1000.0) {
        const dtSec = (timeMillis - lastCalcTime) / 1000.0;
        actualFps = Math.round(frames / dtSec);
        // console.log('fps: ', actualFps);
        document.getElementById('fps').innerHTML = 'fps: ' + Math.round(actualFps);
        frames = 0;
        lastCalcTime = timeMillis;
    }

    if (lastTime) {
        const sinceLast = timeMillis - lastTime;
        console.log('time since last loop:', sinceLast.toFixed(1), 'ms | ', dtMillis, 'ms');
    }
    lastTime = timeMillis;
};