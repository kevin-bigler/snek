/**
 * Listener that's called each time frame rate is calculated
 * @param frameRate
 */
const frameRateListener = (frameRate) => {
    document.getElementById('fps').innerHTML = 'fps: ' + Math.round(frameRate);
};

export default frameRateListener;