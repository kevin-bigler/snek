class GameLoop {
    running = false;

    constructor(fps, fn) {
        this.init(fps, fn);
    }

    init(fps, fn) {
        // const currentTime = () => +new Date();
        // let timeMillis;
        const enqueue = (timeout) => setTimeout(() => requestAnimationFrame(this.loop), timeout);
        const minDtSec = 1.0 / 60.0; // TODO inject config
        const maxDtSec = 3.0 / 60.0; // TODO inject config
        const minDtMillis = minDtSec * 1000.0;
        const maxDtMillis = maxDtSec * 1000.0;
        const sleepTimeMillis = 1; // TODO inject config
        let dtMillis, lastTime = 0, sleepStart;
        let sleeping = false;

        const loop = (timeMillis) => {
            // timeMillis = currentTime();
            if (!this.running) {
                console.log('game loop stopping, because running=false');
                return;
            }

            // see block (D) below for sleep mechanic
            if (!sleeping) {
                // the de facto formula
                dtMillis = timeMillis - lastTime;
            } else {
                dtMillis += timeMillis - sleepStart;
            }

            // minimize compensation for dt being too big
            if (dtMillis > maxDtMillis) {
                dtMillis = maxDtMillis;
            }

            // don't overexert (minimize processes/sec)
            if (dtMillis < minDtMillis) {
                sleepStart = timeMillis;
                enqueue(sleepTimeMillis);
            }

            fn(dtMillis / 1000.0);
            monitorFps(timeMillis);
            lastTime = timeMillis;
            // calls loop() via setTimeout and requestAnimationFrame
            enqueue(0);
        };
        this.loop = loop.bind(this);
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }
}

// TODO: export to FPS Monitor class/module
// TODO: add a RESET function
let frames = 0, actualFps = 0, lastActualFps;
const monitorFps = (timeMillis) => {
    frames++;
    if (!lastActualFps) {
        lastActualFps = timeMillis;
    }
    if (frames > 1000) {
        actualFps = frames / lastActualFps;
        frames = 0;
        lastActualFps = timeMillis;
    }
    console.log('fps: ', actualFps);
};