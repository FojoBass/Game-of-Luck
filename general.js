// LOCAL STORAGE FUNCTIONS
class Storage {
 // Game data
 static setGameData(data) {
  localStorage.setItem('golGameData', JSON.stringify(data));
 }

 static getGameData() {
  return localStorage.getItem('golGameData') ? JSON.parse(localStorage.getItem('golGameData')) : false;
 }

 static delGameData() {
  localStorage.removeItem('golGameData');
 }

 // Score data
 static setScoreData(data) {
  localStorage.setItem('golScoreData', JSON.stringify(data));
 }

 static getScoreData() {
  return localStorage.getItem('golScoreData') ? JSON.parse(localStorage.getItem('golScoreData')) : [];
 }

 static delScoreData() {
  localStorage.removeItem('golScoreData');
 }

 // Settings Data
 static setSettingsData(data) {
  localStorage.setItem('golSettingsData', JSON.stringify(data));
 }

 static getSettingsData() {
  return localStorage.getItem('golSettingsData');
 }
}

// PARAMS
const settingsData = JSON.parse(Storage.getSettingsData());
const loadingSect = document.getElementById('loading-sect');
const loadingImgs = [...document.querySelectorAll('#loading-sect img')];
const videoFile = document.querySelector('video');

let clickMute;
let musicMute;
let counter = 0;


if (settingsData) {
 clickMute = !settingsData.sfx;
 musicMute = !settingsData.music;
}
const musicFile = document.querySelector('.music');

// CLICK EFFECT
clickEff = (e) => {
 e.classList.add('click');
 setTimeout(() => {
  e.classList.remove('click');
 }, 200);
}

// SET SFX MUTE
clickSfxMute = (arg) => {
 clickMute = arg;
};

// SET MUSIC MUTE
setMusicMute = (arg) => {
 musicMute = arg;
 musicMuteFunc();
}

// MUSIC MUTE
musicMuteFunc = () => {
 if (musicFile) {
  if (musicMute) musicFile.muted = musicMute;
  else musicFile.muted = musicMute;
 }
}

// CLICK SFX FUNTIONALITY
clickSfx = (e, soft) => {
 // To use soft click eff, set second argument to true.
 const clickSfx = document.createElement('audio');
 let src = '';
 // console.log(clickMute);
 if (soft) src = '/assests/sfx/mixkit-single-classic-click-1116.wav'
 else src = '/assests/sfx/mixkit-hard-typewriter-click-1119.wav';
 clickSfx.src = src;
 if (!clickMute) clickSfx.play();
 if (e.href) {
  setTimeout(() => {
   window.location.href = e.href
  }, 500);
 }
}


// IMPLEMENTATION
musicMuteFunc();

// LOADING CAROUSEL
setInterval(() => {
 if (loadingImgs.length) {
  loadingImgs.forEach(img => img.classList.remove('show'));
  if (counter >= loadingImgs.length) counter = 0;
  loadingImgs[counter].classList.add('show')
  counter++;
 }
}, 5000)

const loadingInterval = setInterval(() => {
 if (videoFile) {
  if (videoFile.readyState === 4) {
   loadingSect.classList.add('op-hide');
   clearInterval(loadingInterval);
  }
 }
}, 500)


