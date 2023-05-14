// PARAMS
const conBtn = document.getElementById('con');
const newBtn = document.getElementById('new');
const links = [...document.querySelectorAll('a')];
const settingsSect = document.querySelector('.settings-section');
const settingsOpts = document.querySelectorAll('input[type=checkbox]');
const applyBtn = document.querySelector('.apply-btn');
let data = {};

window.addEventListener('DOMContentLoaded', () => {
 // SET FUNCTIONALITY FOR CONTINUE, NEW GAME, AND SOUND EFF
 if (Storage.getGameData()) conBtn.classList.remove('hide');
 links.forEach((a) => {
  a.onclick = (e) => {
   e.preventDefault();
   clickEff(a);
   clickSfx(a);
   if (a.id === 'new') Storage.delGameData()

   if (a.textContent === 'sound') {
    settingsSect.classList.remove('hide');
   }
  };
 })

 // SET SOUND SETTINGS FUNCTIONALITY
 if (!Storage.getSettingsData()) {
  data = { music: true, sfx: true };
  Storage.setSettingsData(data);
 }

 const settingsData = JSON.parse(Storage.getSettingsData());

 settingsOpts.forEach(opt => {
  opt.onclick = () => {
   clickSfx(opt);
  }
  if (opt.value === 'music') opt.checked = settingsData.music;
  else if (opt.value === 'sfx') opt.checked = settingsData.sfx;
 })

 applyBtn.onclick = (e) => {
  // const music = document.querySelector('audio');
  clickSfx(e.currentTarget)
  // clickEff(e.currentTarget)
  settingsOpts.forEach(opt => {
   if (opt.value === 'music') {
    if (!opt.checked)
     setMusicMute(true);
    else setMusicMute(false);
   }
   if (opt.value === 'sfx') {
    if (!opt.checked) clickSfxMute(true)
    else clickSfxMute(false);
   }
  });

  let mus;
  let sfx;
  settingsOpts.forEach(opt => {
   if (opt.value === 'music') mus = opt.checked
   if (opt.value === 'sfx') sfx = opt.checked
  })
  data = { music: mus, sfx };
  Storage.setSettingsData(data);
  settingsSect.classList.add('hide');
 }
})