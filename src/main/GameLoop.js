/**
 * Calculates how long a frame should last, given a frame rate (fps)
 * @param fps
 * @return {number} seconds
 */
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
        const minDtMillis = getFrameDurationMillis(fps * 1.5);
        const maxDtMillis = getFrameDurationMillis(fps / 2.0);
        const sleepTimeMillis = getFrameDurationMillis(fps * 2.0);
        let dtMillis, lastTime = 0, sleepStart;
        let sleeping = false;

        // TODO: remove itr after debugging is complete
        let itr = 0;
        const loop = (timeMillis) => {
            // console.log('loop timeMillis: ', timeMillis, 'itr', itr);
            itr++;
            if (itr > 50) {
                this.running = false;
            }
            // (A) stop() called
            if (!this.running) {
                console.log('game loop stopping, because running=false');
                return;
            }

            // (B) see block (D) below for sleep mechanic
            if (!sleeping) {
                // the de facto formula
                console.log('game loop iteration');
                dtMillis = timeMillis - lastTime;
            } else {
                dtMillis += timeMillis - sleepStart;
            }

            // (C) minimize compensation for dt being too big
            if (dtMillis > maxDtMillis) {
                dtMillis = maxDtMillis;
            }

            // (D) don't overexert (minimize processes/sec)
            // if (dtMillis < minDtMillis) {
            //     console.log('sleeping for', sleepTimeMillis);
            //     sleepStart = timeMillis;
            //     this.enqueue(sleepTimeMillis);
            //     return;
            // }

            // run the main function that we're wrapping in the loop (fn)
            fn(dtMillis / 1000.0);
            monitorFps(timeMillis);
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
        this.loop(+new Date());
    }

    stop() {
        console.log('game loop stop');
        this.running = false;
    }
}

// TODO: export to FPS Monitor class/module
// TODO: add a RESET function
let frames = 0, actualFps = 0, lastActualFps, lastTime;
const monitorFps = (timeMillis) => {
    frames++;
    if (!lastActualFps) {
        lastActualFps = timeMillis;
    }
    if (frames > 1000) {
        frames = 0;
        const dtSec = (timeMillis - lastActualFps) / 1000;
        actualFps = Math.round(frames / dtSec);
        lastActualFps = timeMillis;
        // console.log('fps: ', actualFps);
        document.getElementById('fps').innerHTML = 'fps: ' + actualFps.toFixed(1);
    }

    if (lastTime) {
        const sinceLast = timeMillis - lastTime;
        console.log('time since last loop:', sinceLast.toFixed(1), 'ms');
    }
    lastTime = timeMillis;
};