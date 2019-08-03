/**
 * Listener that's called each time frame rate is calculated
 * @param frameRate
 */
const writeFps = (frameRate) => {
    document.getElementById('fps').innerHTML = 'fps: ' + Math.round(frameRate);
};

export default writeFps;