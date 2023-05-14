const shpId = ['circle', 'triangle', 'square', 'empty'];

// PARAMS
const seeked = document.querySelector('#seeked span');
// Header
const helpBtn = document.querySelector('header button');

// Help
const helpSect = document.getElementById('help');
const closeHelpBtn = document.querySelector('#help .close-btn');

// Entry Select
const selectSect = document.getElementById('select');
const shapes = [...document.querySelectorAll('#select .shape')];
const selectBtn = document.querySelector('#select button');

// Diff Select
const diffSect = document.getElementById('diff');
const diffOpts = [...document.querySelectorAll('input[type=radio]')];
const selDiffBtn = document.querySelector('#diff button');

// Main
const pauseBtn = document.querySelector('.pause');
const rNumCon = document.getElementById('round');
const shapeCons = [...document.querySelectorAll('.shape-container')];
const shps = [...document.querySelectorAll('main .shape')];
const submitShp = document.querySelector('main button');

// Alert
const alertSect = document.getElementById('alert');
const altMsg = document.querySelector('#alert h1');

// Finished
const finSect = document.getElementById('fin');
const rPassed = document.getElementById('passed-rounds');
const remark = document.getElementById('remark');
const restartBtns = [...document.querySelectorAll('.restart')];

// Pause
const pauseSect = document.getElementById('pause');
const resumeBtn = document.getElementById('resume-btn');
const menuBtn = document.getElementById('menu-btn');
const soundBtn = document.getElementById('sound-btn');

// Audio
const music = document.querySelector('audio');

// Settings Section
const settingsSect = document.querySelector('.settings-section');
const settingsOpts = document.querySelectorAll('input[type=checkbox]');
const applyBtn = document.querySelector('.apply-btn');

let sGameData = Storage.getGameData();
let sScoreData = Storage.getScoreData();
let selectedShp = '';
let diff = '';
let round = 1;
let gameData = { diff: '', currRound: round, roundsRem: [], selShp: '' };
let rem = '';
let scoreData = { diff, passed: 0, rem, dd: 0, mm: 0, yy: 00, roundsRem: [] };
let pRounds = 0;
let data = {};


// ON LOAD
window.addEventListener('DOMContentLoaded', ini);

// FUNCTIONS
// Display Help 
function helpInfo() {
  helpBtn.onclick = () => {
    helpSect.classList.remove('hide');
    clickEff(helpBtn);
    clickSfx(helpBtn);
    closeHelpBtn.onclick = () => {
      helpSect.classList.add('hide');
      clickEff(closeHelpBtn);
      clickSfx(closeHelpBtn);
    }
  }
}

// Setup Game
gameSetup = () => {
  let initialSel = '';
  // Shape Selection
  selectSect.classList.remove('hide');
  shapes.forEach((shp) => {
    shp.onclick = () => {
      clickSfx(shp, true);
      unselectAll(shapes, 'shp-slt');
      shp.classList.add('shp-slt');
      selectBtn.classList.remove('deac');
      initialSel = shp.dataset.shape;
    }
  });

  selectBtn.onclick = () => {
    selectedShp = initialSel;
    clickEff(selectBtn);
    clickSfx(selectBtn);
    selectSect.classList.add('hide');
    diffSect.classList.remove('hide');
  }

  // Difficulty Selection
  selDiffBtn.onclick = () => {
    clickEff(selDiffBtn);
    clickSfx(selDiffBtn);
    diffOpts.forEach(opt => {
      if (opt.checked) diff = opt.value;
    })
    diffSect.classList.add('hide');
    play(round);
  }
}

diffOpts.forEach(opt => {
  opt.onchange = () => clickSfx(opt, true);
})

// Main Gameplay
play = (r) => {
  seeked.textContent = selectedShp;
  play2(r);

  let firstSel = null;
  let secondSel = null;

  shapeCons.forEach(con => {
    let check = false;

    con.onclick = () => {
      clickSfx(con, true);
      if (diff === 'easy') {
        if (!con.classList.contains('active')) {
          if (secondSel && secondSel.classList.contains('active')) check = true
          else check = false; // This is to prevent secondSel from un-highlighting after unselecting firstSel

          unselectAll(shapeCons, 'active');
          if (check) secondSel.classList.add('active')

          con.classList.add('active');
          if (!firstSel) {
            firstSel = con;
          } else if (firstSel && !secondSel) {
            firstSel.classList.add('active');
            secondSel = con;
          } else if (firstSel && secondSel) {
            firstSel = con;
            secondSel.classList.remove('active');
            secondSel = null;
          }
        } else {
          con.classList.remove('active');
          if (firstSel === con) {
            firstSel = null;
            if (secondSel) secondSel.classList.add('active');
          } else if (secondSel === con) {
            secondSel = null;
          }
        }
      } else if (diff === 'hard') {
        if (!con.classList.contains('active')) {
          unselectAll(shapeCons, 'active');
          con.classList.add('active');
          firstSel = con;
        } else {
          con.classList.remove('active');
          firstSel = null;
        }
      }

      // activate select btn
      if (shapeCons[0].classList.contains('active') || shapeCons[1].classList.contains('active') || shapeCons[2].classList.contains('active') || shapeCons[3].classList.contains('active')) submitShp.classList.remove('deac')
      else submitShp.classList.add('deac');
    }
  })

  submitShp.onclick = () => {
    clickEff(submitShp);
    clickSfx(submitShp);
    if (firstSel) firstSel.classList.add('show');
    if (secondSel) secondSel.classList.add('show');
    submitShp.classList.add('deac');
    pauseBtn.classList.add('deac');

    setTimeout(() => {
      pauseBtn.classList.remove('deac');
      shpSubmit(firstSel, secondSel);
    }, 1800)
  };
}

play2 = (i) => {
  let shpInd = [];

  rNumCon.textContent = i;
  for (; ;) {
    const rNum = Math.floor(Math.random() * 4);
    if (!shpInd.length) shpInd.push(rNum)
    else {
      if (!shpInd.includes(rNum)) {
        shpInd.push(rNum);
        if (shpInd.length === 4) break;
      }
    }
  }

  for (i = 0; i < shps.length; i++) shps[i].classList.add(`${shpId[shpInd[i]]}`);
}

// Submit highlighted shapes
shpSubmit = (f, s) => {
  let fShp = null;
  let sShp = null;

  if (f) fShp = f.children[0].classList[1];
  if (s) sShp = s.children[0].classList[1];

  if (fShp === selectedShp || sShp === selectedShp) checkShps(true)
  else checkShps(false);

  if (f) fShp = f.classList.remove('show');
  if (s) sShp = s.classList.remove('show');

  setTimeout(() => {
    // Remove classes from shps i.e circle, square etc.
    shps.forEach(shp => shp.classList.remove(shp.classList[1]));

    if (f) fShp = f.classList.remove('active');
    if (s) sShp = s.classList.remove('active');
    submitShp.classList.add('deac');

    if (round < 5) {
      round++;
      play(round);
    } else {
      pRounds = gameData.roundsRem.filter(r => r === 'passed').length;
      switch (pRounds) {
        case 0:
          rem = 'very unlucky';
          break;
        case 1:
          rem = 'unlucky';
          break;
        case 2:
          rem = 'quite unlucky';
          break;
        case 3:
          rem = 'quite lucky';
          break;
        case 4:
          rem = 'lucky';
          break;
        case 5:
          rem = 'very lucky';
          break;
      };

      rPassed.textContent = format(pRounds);
      remark.textContent = rem;
      finSect.classList.remove('hide');
      if (rem.includes('unlucky')) remark.classList.add('unlucky')
      else if (rem.includes('lucky')) remark.classList.add('lucky');

      const date = new Date();
      scoreData.diff = diff;
      scoreData.rem = rem;
      scoreData.passed = pRounds;
      scoreData.roundsRem = gameData.roundsRem;
      scoreData.dd = date.getDate();
      scoreData.mm = date.getMonth();
      scoreData.yy = date.getFullYear();

      sScoreData.push(scoreData);
      Storage.setScoreData(sScoreData);
      Storage.delGameData();
    }
  }, 3600)
}

// Check highlighted shapes and seeked shape
function checkShps(state) {
  alertSect.classList.remove('hide');
  altMsg.classList.remove('failed')
  if (state) altMsg.textContent = 'passed'
  else {
    altMsg.classList.add('failed')
    altMsg.textContent = 'failed'
  };

  gameData.currRound = round;
  gameData.roundsRem.push(altMsg.textContent);
  gameData.diff = diff;
  gameData.selShp = selectedShp;

  Storage.setGameData(gameData);

  setTimeout(() => {
    alertSect.classList.add('hide');
  }, 3500);
}

// Remove style from all items in an array
unselectAll = (es, c) => es.forEach(e => e.classList.remove(c));

// Formating
function format(n) {
  if (n === 1) return `${n} round`
  else return `${n} rounds`;
}

// EVENT LISTENERS
// For On Load
function ini() {
  helpInfo();

  if (sGameData) {
    gameData = sGameData;
    diff = sGameData.diff;
    round = sGameData.currRound + 1;
    selectedShp = sGameData.selShp;
    play(round);
  } else {
    gameSetup();
  }

  pauseBtn.onclick = () => {
    clickOps(pauseBtn);
    pauseSect.classList.remove('hide');

    resumeBtn.onclick = () => {
      clickOps(resumeBtn);
      pauseSect.classList.add('hide');
    }

    menuBtn.onclick = (e) => {
      e.preventDefault();
      clickOps(menuBtn);
      pauseSect.classList.add('hide');
    }

    soundBtn.onclick = () => {
      clickOps(soundBtn);
      pauseSect.classList.add('hide');
      settingsSect.classList.remove('hide');
    }

    // Yeah I know there were countless unnecessary repetitions. Well, I couldn't start refactoring my codes from the html to js, would take more time, so I took the easiest route. And no, I'm not a coward :)
  }

  restartBtns.forEach((r) => {
    r.onclick = (e) => {
      e.preventDefault();
      clickOps(r);
      Storage.delGameData();
    }
  })

  document.querySelector('.menu-btn').onclick = (e) => {
    e.preventDefault();
    clickEff(e.currentTarget);
    clickSfx(e.currentTarget);
  }

  // SET SOUND SETTINGS FUNCTIONALITY
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
}

// UTILITY FUNCTIONS
const clickOps = (e) => {
  clickEff(e);
  clickSfx(e);
}
