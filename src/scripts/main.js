const state = {
    views: {
        frequency: {
            slider: document.querySelector("#frequency-selector"),
            value: document.querySelector("#frequency-value"),
        },
        togglePlay: {
            button: document.querySelector("#toggle-play-button"),
        },
        masterVolume: {
            slider: document.querySelector("#master-volume-selector"),
            value: document.querySelector("#master-volume-value"),
        }
    },
    values: {
        frequency: 440,
        masterVolume: 0.2,
        playing: false,
        started: false,
    },
}

// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
// create master volume node
const masterVolume = audioCtx.createGain();

oscillator.connect(masterVolume);


function init() {

    createMasterVolumeHandler();
    createFrequencyHandler();
    createTogglePlayHandler();
}

init();

function createFrequencyHandler(){
    state.views.frequency.slider.addEventListener("input", (e) => {
        const newFrequency = e.target.value;
        state.values.frequency = newFrequency;
        state.views.frequency.value.innerText = newFrequency;

        oscillator.frequency.setTargetAtTime(newFrequency, audioCtx.currentTime, 0.1);
    });
}

function createTogglePlayHandler(){
    state.views.togglePlay.button.addEventListener("click", () =>{
        togglePlay();
        if(state.values.playing){
            state.views.togglePlay.button.innerText = "Stop";
        } else {
            state.views.togglePlay.button.innerText = "Start";
        }
    });
}

function togglePlay() {
    if(!state.values.playing){
        if(!state.values.started){
            oscillator.start(0);
            state.values.started = true;
        }
        startPlaying();
        state.views.togglePlay.button.classList.remove("not-playing");
        state.views.togglePlay.button.classList.add("playing");
        
    } else {
        state.views.togglePlay.button.classList.remove("playing");
        state.views.togglePlay.button.classList.add("not-playing");
        stopPlaying();
    }
    state.values.playing = !state.values.playing;

}

function startPlaying(){
    console.log("start playing");
    masterVolume.connect(audioCtx.destination);
}

function stopPlaying(){
    console.log("stop playing");
    masterVolume.disconnect(audioCtx.destination);
}

function createMasterVolumeHandler() {
    state.views.masterVolume.slider.addEventListener("input", (e) => {
        const newVolume = e.target.value / 100;
        state.values.masterVolume = newVolume;
        state.views.masterVolume.value.innerText = newVolume * 100;

        masterVolume.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.01);
    })
}