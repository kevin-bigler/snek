// const gameLoop = (name, frameRate) => {
//     setTimeout(() => {
//         requestAnimationFrame(name);
//     }, 1000 / frameRate);
// };

let accumulatedTime = 0;
let deltaTime = 0;
let lastTime = 0;
let fps = 0;

class GameLoop {
    running = false;

    constructor() {
        this.init();
    }

    init(fps, fn) {
        // const currentTime = () => +new Date();
        // let timeMillis;
        const enqueue = (timeout) => setTimeout(() => requestAnimationFrame(this.loop), timeout);
        const minDtMillis = 1.0 / 60.0; // TODO inject config
        const maxDtMillis = 3.0 / 60.0; // TODO inject config
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

            fn(dtMillis);
            monitorFps(timeMillis);
            lastTime = timeMillis;
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

    update(time) {
        accumulatedTime += (time - lastTime) / 1000;

        if (accumulatedTime > 1) {
            accumulatedTime = 1;
        }

        while (accumulatedTime > fps) {
            this.update(fps);
            accumulatedTime -= fps;
        }

        lastTime = time;

        requestAnimationFrame(this.update);
    }
}

// const gameLoop = (fps, fn) => setTimeout(() => requestAnimationFrame(fn), 1000 / fps);

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