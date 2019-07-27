export default class FpsCalculator {
    frames = 0;
    /**
     * Last-calculated fps
     * @type {number}
     */
    actualFps = 0;
    /**
     * Last time fps was updated
     * @type {number}
     */
    lastCalcTime;

    /**
     * Gets new fps value after adding a new frame timestamp ({@link timeMillis})
     *
     * @param {number} timeMillis The current time in millis
     * @return {number} New fps value
     */
    recalculateFps(timeMillis) {
        this.frames++;
        if (!this.lastCalcTime) {
            this.lastCalcTime = timeMillis;
        }
        if (timeMillis > this.lastCalcTime + 1000.0) {
            const dtSec = (timeMillis - this.lastCalcTime) / 1000.0;
            this.actualFps = Math.round(frames / dtSec);
            // console.log('fps: ', actualFps);
            this.frames = 0;
            this.lastCalcTime = timeMillis;
        }

        return this.actualFps;
    }

    reset() {
        // TODO
    }
}