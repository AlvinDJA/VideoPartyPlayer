const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons use');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const fullscreenIcons = fullscreenButton.querySelectorAll('use');
const pipButton = document.getElementById('pip-button');
const ruta = document.getElementById('ruta');
const contenedor = document.getElementById('ContenedorControles');
let cargado = false;
var t = setInterval(chargeVideo, 1000);


export function videoWorks() {
    if (!Number.isNaN(video.duration)) {
        return true;
    }
    else
        return false;
}

export function reload() {
    cargado = false;
    t = setInterval(chargeVideo, 1000);
}

function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

    return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
    };
}

export function Inicializar() {
    const videoWorks = !!document.createElement('video').canPlayType;
    if (videoWorks) {
        video.controls = false;
        videoControls.classList.remove('hidden');
    }
    const videoDuration = Math.round(video.duration);
    const time = formatTime(videoDuration);

    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

export function togglePlay() {
    if (video.paused || video.ended) {
        video.play();
        videoControls.classList.add('hidden');
    } else {
        video.pause();
        videoControls.classList.remove('hidden');
    }
}

export function pauseVideo() {
        video.pause();
        videoControls.classList.remove('hidden');
}

function updatePlayButton() {
    const playbackIcons = document.querySelectorAll('.playback-icons use');
    playbackIcons.forEach((icon) => icon.classList.toggle('hidden'));

    if (video.paused) {
        playButton.setAttribute('data-title', 'Play (k)');
    } else {
        playButton.setAttribute('data-title', 'Pause (k)');
    }
}


export function updateVideo() {
    updateTimeElapsed();
    updateProgress();
}

export function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));

    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

export function updateProgress() {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
}

export function updateVolume() {

    if (video.muted) {
        video.muted = false;
    }

    video.volume = volume.value;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volumeIcons = document.querySelectorAll('.volume-button use');
    const volumeMute = document.querySelector('use[href="#volume-mute"]');
    const volumeLow = document.querySelector('use[href="#volume-low"]');
    const volumeHigh = document.querySelector('use[href="#volume-high"]');

    volumeIcons.forEach((icon) => {
        icon.classList.add('hidden');
    });

    volumeButton.setAttribute('data-title', 'Mute (m)');

    if (video.muted || video.volume === 0) {
        volumeMute.classList.remove('hidden');
        volumeButton.setAttribute('data-title', 'Unmute (m)');
    } else if (video.volume > 0 && video.volume <= 0.5) {
        volumeLow.classList.remove('hidden');
    } else {
        volumeHigh.classList.remove('hidden');
    }
}

function animatePlayback() {

    playbackAnimation.animate(
        [
            {
                opacity: 1,
                transform: 'scale(1)',
            },
            {
                opacity: 0,
                transform: 'scale(1.3)',
            },
        ],
        {
            duration: 500,
        }
    );
}

function updateSeekTooltip(event) {
    const skipTo = Math.round(
        (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute('max'), 10)
    );
    seek.setAttribute('data-seek', skipTo);
    const t = formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = video.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
}


function skipAhead(event) {
    const skipTo = event.target.dataset.seek
        ? event.target.dataset.seek
        : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
}

export function skipTo(to) {
    video.currentTime = to;
    progressBar.value = to;
    seek.value = to;
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
        // Need this to support Safari
        document.webkitExitFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        // Need this to support Safari
        videoContainer.webkitRequestFullscreen();
    } else {
        videoContainer.requestFullscreen();
    }
}

async function togglePip() {
    try {
        if (video !== document.pictureInPictureElement) {
            pipButton.disabled = true;
            await video.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    } catch (error) {
        console.error(error);
    } finally {
        pipButton.disabled = false;
    }
}

function updateFullscreenButton() {
    fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));

    if (document.fullscreenElement) {
        fullscreenButton.setAttribute('data-title', 'Exit full screen (f)');
    } else {
        fullscreenButton.setAttribute('data-title', 'Full screen (f)');
    }
}

function keyboardShortcuts(event) {
    const { key } = event;
    switch (key) {
        case 'k':
            togglePlay();
            animatePlayback();
            if (video.paused) {
                showControls();
            } else {
                setTimeout(() => {
                    hideControls();
                }, 2000);
            }
            break;
        case 'm':
            toggleMute();
            break;
        case 'f':
            toggleFullScreen();
            break;
        case 'p':
            togglePip();
            break;
    }
}
//function keyboardShortcutsD(event) {
//    const { key2 } = event;
//    switch (key2) {
//        case 'x':
//            toggleFullScreen();
//            break;
//    }
//}
function hideContenedor() {
    videoControls.classList.remove('hidden');
}

function showContenedor() {
    videoControls.classList.add('hidden');
}

function toggleMute() {
    video.muted = !video.muted;

    if (video.muted) {
        volume.setAttribute('data-volume', volume.value);
        volume.value = 0;
    } else {
        volume.value = volume.dataset.volume;
    }
}


function chargeVideo() {
    if (!cargado) {
        if (!Number.isNaN(video.duration)) {
            Inicializar();
            cargado = true;
            clearInterval(t)
        }
    }
}

////My implemntation

export function togglePlay2() {
    const video = document.getElementById('video');
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}

export function isVideoPlaying(id) {
    const video = document.getElementById(id);
    if (video.paused || video.ended)
        return false;
    else
        return true;
}

export function getCurrentTime() {
    const time = Math.round(video.currentTime);
    return time;
}

export function getName() {
    const [file] = ruta.files;
    return file.name;
}

export function changeVideo() {
    const [file] = ruta.files
    if (file) {
        video.src = URL.createObjectURL(file);
    }
}

function mouseMoving() {
    alert('move');
}

//playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
volume.addEventListener('input', updateVolume);
video.addEventListener('volumechange', updateVolumeIcon);
//video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
video.addEventListener('dblclick', toggleFullScreen);

contenedor.addEventListener('mouseover', hideContenedor);
contenedor.addEventListener('mouseleave', showContenedor);

seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volumeButton.addEventListener('click', toggleMute);
fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);
pipButton.addEventListener('click', togglePip);
ruta.addEventListener('change', changeVideo);
ruta.addEventListener('input', changeVideo);
//document.addEventListener('mouseleave', mouseMoving);
document.addEventListener('timeupdate', chargeVideo);


document.addEventListener('DOMContentLoaded', () => {
    if (!('pictureInPictureEnabled' in document)) {
        pipButton.classList.add('hidden');
    }
});



video.addEventListener('keyup', keyboardShortcuts);
//document.addEventListener('keyup', keyboardShortcutsD);

ruta.oninput = evt => {
    const [file] = ruta.files
    if (file) {
        video.src = URL.createObjectURL(file);
    }
}

