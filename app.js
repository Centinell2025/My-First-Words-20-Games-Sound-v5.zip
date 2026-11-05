'use strict';
const el=id=>document.getElementById(id);
const codes=Object.keys(LANGUAGES);
let sourceLanguage='en',targetLanguage='es',muted=false,gameIndex=-1,step=0,correct=false;
let advanceTimer=null,audioContext=null,availableVoices=[],speechRun=0,cancelUtterance=null;
const explored=new Map();
const voicePreferences={};
try{
  const saved=JSON.parse(localStorage.getItem('mfw-language-pair')||'null');
  if(saved&&codes.includes(saved.source)&&codes.includes(saved.target)&&saved.source!==saved.target){
    sourceLanguage=saved.source;targetLanguage=saved.target;
  }
}catch{/* Learning works even when browser storage is disabled. */}
const ui=key=>UI[sourceLanguage][key];
const pairKey=()=>sourceLanguage+'>'+targetLanguage;
function cancelAdvance(){if(advanceTimer!==null){clearTimeout(advanceTimer);advanceTimer=null;}}
function stopSpeech(){
  speechRun++;
  if(cancelUtterance){cancelUtterance();cancelUtterance=null;}
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
}
function setPair(source,target){
  if(!codes.includes(source)||!codes.includes(target))return;
  if(source===target)target=codes.find(code=>code!==source);
  cancelAdvance();stopSpeech();
  sourceLanguage=source;targetLanguage=target;
  try{localStorage.setItem('mfw-language-pair',JSON.stringify({source,target}));}catch{}
  renderHome();updateCover();renderLanguageSettings();updateProgress();
  if(gameIndex>=0&&!el('game').classList.contains('hidden'))renderGame(false);
}
function renderLanguageSettings(){
  document.documentElement.lang=sourceLanguage;
  for(const [id,selected] of [['sourceLanguage',sourceLanguage],['targetLanguage',targetLanguage]]){
    const select=el(id);select.replaceChildren();
    for(const code of codes){
      const option=document.createElement('option');option.value=code;option.textContent=LANGUAGES[code].name;
      option.lang=code;option.disabled=id==='targetLanguage'&&code===sourceLanguage;select.append(option);
    }
    select.value=selected;
  }
  el('sourceLabel').textContent=ui('source');el('targetLabel').textContent=ui('target');
  el('pairSummary').textContent=LANGUAGES[sourceLanguage].name+' → '+LANGUAGES[targetLanguage].name;
  el('swapLanguages').setAttribute('aria-label',ui('swap'));
  el('pairHelp').textContent=ui('pairHelp');
  el('lang').textContent=sourceLanguage.toUpperCase()+' → '+targetLanguage.toUpperCase();
  el('lang').setAttribute('aria-label',ui('languageSettings'));
  el('coverLanguage').textContent='🌐 '+ui('languageSettings');
  updateVoiceStatus();
}
function openLanguages(){
  el('languageSettings').open=true;
  el('languageSettings').scrollIntoView({block:'center',behavior:'smooth'});
  el('sourceLanguage').focus({preventScroll:true});
}
function updateVoiceStatus(){
  if(!('speechSynthesis' in window)){el('voiceStatus').textContent=ui('noSpeech');return;}
  const missing=[sourceLanguage,targetLanguage].filter(code=>!availableVoices.some(v=>v.lang.toLowerCase().split('-')[0]===code));
  el('voiceStatus').textContent=missing.length?ui('noVoice')+missing.map(code=>LANGUAGES[code].name).join(', '):'';
}
function refreshVoices(){
  if('speechSynthesis' in window)availableVoices=window.speechSynthesis.getVoices()||[];
  updateVoiceChoices();updateVoiceStatus();
}
function updateVoiceChoices(){
  const select=el('voiceChoice');select.replaceChildren();
  const auto=document.createElement('option');auto.value='';auto.textContent=ui('auto');select.append(auto);
  for(const voice of availableVoices){
    if(voice.lang.toLowerCase().split('-')[0]!==targetLanguage)continue;
    const option=document.createElement('option');option.value=voice.voiceURI;option.textContent=voice.name+' — '+voice.lang;select.append(option);
  }
  const selected=voicePreferences[targetLanguage];
  if(selected&&[...select.options].some(option=>option.value===selected))select.value=selected;
}
function chosenVoice(code){
  const candidates=availableVoices.filter(v=>v.lang.toLowerCase().split('-')[0]===code);
  const preferred=code===targetLanguage&&voicePreferences[code];
  if(preferred){const voice=candidates.find(v=>v.voiceURI===preferred);if(voice)return voice;}
  const desired=LANGUAGES[code].locale.toLowerCase();
  const score=v=>(v.lang.toLowerCase()===desired?8:0)+(v.localService?3:0)+(v.default?2:0)+(/natural|enhanced|premium|neural/i.test(v.name)?5:0);
  return candidates.sort((a,b)=>score(b)-score(a))[0]||null;
}
async function speakSequence(parts){
  stopSpeech();const run=speechRun;
  if(muted||!('speechSynthesis' in window))return;
  availableVoices=window.speechSynthesis.getVoices()||[];updateVoiceStatus();
  for(const {text,code} of parts){
    if(run!==speechRun||muted)break;
    const voice=chosenVoice(code);
    // Never pronounce foreign words using a fallback voice in another language.
    if(!voice)continue;
    await new Promise(resolve=>{
      const u=new SpeechSynthesisUtterance(String(text));
      u.voice=voice;u.lang=voice.lang;u.rate=Number(el('voiceSpeed').value)||0.88;u.pitch=1.04;u.volume=0.88;
      let finished=false;
      const finish=()=>{if(finished)return;finished=true;clearTimeout(watchdog);if(cancelUtterance===finish)cancelUtterance=null;resolve();};
      const watchdog=setTimeout(()=>{if(run===speechRun)window.speechSynthesis.cancel();finish();},15000);
      u.onend=finish;u.onerror=finish;cancelUtterance=finish;
      try{window.speechSynthesis.speak(u);}catch{finish();}
    });
  }
}
function wordParts(item){return [{text:wordIn(item,sourceLanguage),code:sourceLanguage},{text:wordIn(item,targetLanguage),code:targetLanguage}];}
function speakWord(item){return speakSequence(wordParts(item));}
function tone(freq=650,duration=.12){
  if(muted)return;
  try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioContext=audioContext||new AC();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),gain=audioContext.createGain();o.type='sine';o.frequency.value=freq;gain.gain.setValueAtTime(.022,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(gain);gain.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch{}
}
function updateAge(){el('ageTip').textContent=ui(el('age').value==='12'?'young':el('age').value==='18'?'middle':'older');}
function renderHome(){
  const labels={tagline:'tagline',welcome:'welcome',subtitle:'subtitle',pick:'pick',parentTitle:'parents',parentIntro:'parentIntro',voiceTitle:'voiceTitle',speedLabel:'speed',voiceLabel:'voice',voicePreview:'preview',voiceNote:'voiceNote',ageLabel:'age',footer:'footer'};
  for(const [id,key] of Object.entries(labels))el(id).textContent=ui(key);
  el('test').textContent='🔊 '+ui('test');
  el('voiceSpeed').options[0].textContent=ui('slow');el('voiceSpeed').options[1].textContent=ui('clear');el('voiceSpeed').options[2].textContent=ui('normal');
  el('voiceSpeed').setAttribute('aria-label',ui('speed'));el('voiceChoice').setAttribute('aria-label',ui('voice'));
  const ageUnits={en:['months','months','months'],es:['meses','meses','meses'],fr:['mois','mois','mois'],pt:['meses','meses','meses'],de:['Monate','Monate','Monate'],it:['mesi','mesi','mesi'],ja:['か月','か月','か月'],ko:['개월','개월','개월']}[sourceLanguage];
  ['12–18','18–24','24–36'].forEach((range,i)=>el('age').options[i].textContent=range+' '+ageUnits[i]);
  el('age').setAttribute('aria-label',ui('age'));el('sound').setAttribute('aria-label',ui('test'));el('sound').setAttribute('aria-pressed',String(muted));
  el('tiles').replaceChildren();
  GAMES.forEach((g,i)=>{
    const b=document.createElement('button');b.type='button';b.className='tile';
    const icon=document.createElement('span');icon.className='emoji';icon.textContent=g[0];
    const title=document.createElement('strong');title.lang=sourceLanguage;title.textContent=categoryIn(i,sourceLanguage);
    const learning=document.createElement('div');learning.className='muted small';learning.lang=targetLanguage;learning.textContent=categoryIn(i,targetLanguage);
    b.append(icon,title,learning);b.onclick=()=>openGame(i);el('tiles').append(b);
  });updateVoiceChoices();updateAge();
}
function updateCover(){
  for(const id of ['startPlaying','coverFallbackPlay']){el(id).textContent='▶ '+ui('play');el(id).setAttribute('aria-label',ui('play'));}
  for(const button of document.querySelectorAll('[data-cover-game]')){const index=Number(button.dataset.coverGame);button.textContent=GAMES[index][0]+' '+categoryIn(index,sourceLanguage);button.setAttribute('aria-label',categoryIn(index,sourceLanguage));}
  el('coverMore').textContent='✨ '+ui('allGames');el('coverMore').setAttribute('aria-label',ui('allGames'));
  el('coverParent').textContent=ui('parentCover');el('welcomeCover').setAttribute('aria-label',ui('welcome'));
}
function openGame(index){
  cancelAdvance();stopSpeech();document.body.classList.remove('coverActive');el('welcomeCover').setAttribute('aria-hidden','true');
  if(typeof index==='number'){
    gameIndex=index;step=0;el('home').classList.add('hidden');el('game').classList.remove('hidden');renderGame();
    el('game').scrollIntoView({block:'start'});
  }else{gameIndex=-1;el('game').classList.add('hidden');el('home').classList.remove('hidden');el('pick').scrollIntoView({block:'nearest'});}
}
function updateProgress(){
  const words=explored.get(pairKey())||new Set();
  el('progressText').textContent=ui('progress')+': '+words.size+'/80';el('progressFill').style.width=(words.size/80*100)+'%';
}
function showWordPair(item){
  el('wordPair').replaceChildren();
  for(const [index,code] of [sourceLanguage,targetLanguage].entries()){
    if(index){const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');el('wordPair').append(arrow);}
    const chip=document.createElement('div');chip.className='word-chip'+(index?' learning':'');
    const label=document.createElement('small');label.lang=code;label.textContent=LANGUAGES[code].name;
    const word=document.createElement('strong');word.lang=code;word.textContent=wordIn(item,code);chip.append(label,word);el('wordPair').append(chip);
  }
}
function renderGame(playAudio=true){
  cancelAdvance();stopSpeech();correct=false;
  const g=GAMES[gameIndex],target=g[3][step];
  el('lessonProgress').textContent=ui('game')+' '+(gameIndex+1)+'/20 · '+ui('picture')+' '+(step+1)+'/4';
  el('gameEmoji').textContent=ANIMAL_SOUNDS[target[1]]?target[0]:g[0];
  el('gameTitle').textContent=categoryIn(gameIndex,sourceLanguage)+' · '+categoryIn(gameIndex,targetLanguage);
  el('instructions').textContent=ui('instructions');el('target').textContent=ui('touch')+': '+target[0];showWordPair(target);
  el('repeat').textContent='🔊 '+ui('listen');el('soundEffect').textContent=ANIMAL_SOUNDS[target[1]]?'🐾 '+ui('hearAnimal'):'🎵 '+ui('funSound');
  el('next').textContent=ui('next')+' →';el('next').disabled=true;el('back').textContent='← '+ui('allGames');
  el('grownup').textContent='💚 '+ui('together');el('coach').textContent=ui('coach');el('feedback').textContent='';
  el('choices').replaceChildren();updateProgress();
  const distractor=g[3][(step+1)%4],items=step%2===0?[target,distractor]:[distractor,target];
  for(const item of items){
    const b=document.createElement('button');b.className='choice';b.type='button';b.dataset.correct=String(item===target);
    const icon=document.createElement('span');icon.className='emoji';icon.textContent=item[0];
    const learning=document.createElement('strong');learning.lang=targetLanguage;learning.textContent=wordIn(item,targetLanguage);
    const source=document.createElement('small');source.className='source-word';source.lang=sourceLanguage;source.textContent=wordIn(item,sourceLanguage);
    b.append(icon,learning,source);
    b.onclick=()=>{
      if(correct)return;
      if(item!==target){
        el('choices').querySelector('[data-correct="true"]').classList.add('hint');el('feedback').textContent=ui('try');speakWord(target);return;
      }
      correct=true;b.classList.add('correct');
      const mark=document.createElement('span');mark.className='answer-mark';mark.textContent='✓';mark.setAttribute('aria-hidden','true');b.append(mark);
      for(const button of el('choices').querySelectorAll('button'))button.disabled=true;
      el('next').disabled=false;el('feedback').textContent=ui('good');
      if(!explored.has(pairKey()))explored.set(pairKey(),new Set());explored.get(pairKey()).add(gameIndex+':'+step);updateProgress();
      praiseAndAdvance(target);
    };el('choices').append(b);
  }
  if(playAudio)speakWord(target);
}
async function praiseAndAdvance(item){
  cancelAdvance();const currentGame=gameIndex,currentStep=step,currentPair=pairKey();
  const promise=speakSequence([{text:ui('good'),code:sourceLanguage},...wordParts(item)]);
  const run=speechRun;await promise;
  if(run===speechRun&&correct&&gameIndex===currentGame&&step===currentStep&&pairKey()===currentPair)scheduleAdvance();
}
function scheduleAdvance(){cancelAdvance();advanceTimer=setTimeout(()=>{advanceTimer=null;advanceLesson();},1800);}
function advanceLesson(){
  if(gameIndex<0||!correct)return;
  cancelAdvance();stopSpeech();step++;
  if(step>=4){step=0;gameIndex++;}
  if(gameIndex>=GAMES.length){
    gameIndex=-1;el('game').classList.add('hidden');el('home').classList.remove('hidden');renderHome();el('welcome').textContent=explored.get(pairKey())?.size===80?ui('completed'):ui('good');el('welcome').scrollIntoView({block:'center'});return;
  }renderGame();
}
async function repeatCurrent(){
  if(gameIndex<0)return;cancelAdvance();
  const currentGame=gameIndex,currentStep=step,currentPair=pairKey(),wasCorrect=correct;
  const promise=speakWord(GAMES[gameIndex][3][step]),run=speechRun;await promise;
  if(wasCorrect&&correct&&run===speechRun&&gameIndex===currentGame&&step===currentStep&&pairKey()===currentPair)scheduleAdvance();
}
async function playEffect(){
  if(gameIndex<0)return;cancelAdvance();
  const item=GAMES[gameIndex][3][step],sounds=ANIMAL_SOUNDS[item[1]];
  const currentGame=gameIndex,currentStep=step,wasCorrect=correct;
  let promise;
  if(sounds){
    const parts=[];
    for(const code of [sourceLanguage,targetLanguage])parts.push({text:wordIn(item,code)+'. '+sounds[codes.indexOf(code)],code});
    promise=speakSequence(parts);
  }else{tone(520);promise=Promise.resolve();}
  const run=speechRun;await promise;
  if(wasCorrect&&correct&&run===speechRun&&gameIndex===currentGame&&step===currentStep)scheduleAdvance();
}
const progress=document.createElement('div');progress.id='progress';
const progressText=document.createElement('span');progressText.id='progressText';
const progressTrack=document.createElement('div');progressTrack.id='progressTrack';progressTrack.setAttribute('aria-hidden','true');
const progressFill=document.createElement('div');progressFill.id='progressFill';progressTrack.append(progressFill);progress.append(progressText,progressTrack);el('choices').before(progress);
el('sourceLanguage').onchange=()=>setPair(el('sourceLanguage').value,targetLanguage===el('sourceLanguage').value?sourceLanguage:targetLanguage);
el('targetLanguage').onchange=()=>setPair(sourceLanguage,el('targetLanguage').value);
el('swapLanguages').onclick=()=>setPair(targetLanguage,sourceLanguage);
el('lang').onclick=openLanguages;el('coverLanguage').onclick=openLanguages;
el('coverEnglish').onclick=()=>setPair('en',targetLanguage==='en'?sourceLanguage:targetLanguage);
el('coverSpanish').onclick=()=>setPair('es',targetLanguage==='es'?sourceLanguage:targetLanguage);
el('startPlaying').onclick=()=>openGame();el('coverFallbackPlay').onclick=()=>openGame();el('coverMore').onclick=()=>openGame();
for(const button of document.querySelectorAll('[data-cover-game]'))button.onclick=()=>openGame(Number(button.dataset.coverGame));
el('voiceChoice').onchange=()=>{voicePreferences[targetLanguage]=el('voiceChoice').value;};
el('voicePreview').onclick=()=>speakWord(GAMES[0][3][0]);el('test').onclick=()=>{tone();speakWord(GAMES[0][3][0]);};
el('sound').onclick=()=>{muted=!muted;stopSpeech();el('sound').textContent=muted?'🔇':'🔊';el('sound').setAttribute('aria-pressed',String(muted));if(correct)scheduleAdvance();};
el('age').onchange=updateAge;
el('back').onclick=()=>{cancelAdvance();stopSpeech();gameIndex=-1;el('game').classList.add('hidden');el('home').classList.remove('hidden');};
el('repeat').onclick=repeatCurrent;el('soundEffect').onclick=playEffect;el('next').onclick=advanceLesson;
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAdvance();stopSpeech();}});
document.body.classList.add('coverActive');renderHome();updateCover();renderLanguageSettings();updateProgress();
if('speechSynthesis' in window){window.speechSynthesis.addEventListener('voiceschanged',refreshVoices);refreshVoices();}
if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
