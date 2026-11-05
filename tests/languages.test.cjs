const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function context(voices=[]){
  const elements={voiceSpeed:{value:'0.88'},voiceStatus:{textContent:''}};
  const spoken=[];
  const context=vm.createContext({console,setTimeout,clearTimeout,document:{getElementById:id=>elements[id]},
    window:{speechSynthesis:{cancel(){},getVoices:()=>voices,speak(u){spoken.push({text:u.text,lang:u.lang,voice:u.voice});queueMicrotask(()=>u.onend?.());}}},
    SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}});
  vm.runInContext(fs.readFileSync(path.join(root,'languages.js'),'utf8'),context);
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8').split('const progress=document.createElement')[0];
  vm.runInContext(app,context);
  return {context,elements,spoken,run:code=>vm.runInContext(code,context)};
}
test('all 56 directions cover all 80 picture prompts and interface labels',()=>{
  const {run}=context();
  const result=JSON.parse(run(`JSON.stringify((()=>{
    const codes=Object.keys(LANGUAGES);let prompts=0;
    for(const code of codes){
      if(UI_KEYS.some(key=>!UI[code][key]))throw Error('Missing interface '+code);
      for(let i=0;i<GAMES.length;i++)if(!categoryIn(i,code))throw Error('Missing category');
    }
    for(const source of codes)for(const target of codes){if(source===target)continue;
      for(const game of GAMES)for(const item of game[3]){
        if(!wordIn(item,source)||!wordIn(item,target))throw Error('Missing translation');prompts++;
      }
    }return {languages:codes.length,games:GAMES.length,prompts};
  })())`));
  assert.deepEqual(result,{languages:8,games:20,prompts:4480});
});
const voices=['es-ES','fr-FR','en-US','ja-JP'].map(lang=>({name:lang,voiceURI:lang,lang,localService:true}));
test('pronunciation queues source then target with matching native voices',async()=>{
  const {run,spoken}=context(voices);
  await run("sourceLanguage='es';targetLanguage='fr';speakWord(GAMES[0][3][0])");
  assert.deepEqual(spoken.map(u=>[u.text,u.lang]),[['Perro','es-ES'],['Chien','fr-FR']]);
  await run("sourceLanguage='fr';targetLanguage='es';speakWord(GAMES[0][3][0])");
  assert.deepEqual(spoken.slice(2).map(u=>[u.text,u.lang]),[['Chien','fr-FR'],['Perro','es-ES']]);
});
test('missing target voice is reported and never replaced with another language',async()=>{
  const {run,spoken,elements}=context(voices);
  await run("sourceLanguage='es';targetLanguage='ko';speakWord(GAMES[0][3][0])");
  assert.deepEqual(spoken.map(u=>u.lang),['es-ES']);
  assert.match(elements.voiceStatus.textContent,/한국어/);
});
test('muting suppresses the entire bilingual sequence',async()=>{
  const {run,spoken}=context(voices);
  await run("muted=true;speakWord(GAMES[0][3][0])");assert.equal(spoken.length,0);
});
test('interrupting an utterance prevents its pending second language from playing',async()=>{
  const {run,context:ctx,spoken}=context(voices);
  ctx.window.speechSynthesis.speak=u=>{spoken.push({text:u.text,lang:u.lang});};
  const pending=run("sourceLanguage='es';targetLanguage='fr';speakWord(GAMES[0][3][0])");
  run('stopSpeech()');await pending;
  assert.deepEqual(spoken.map(u=>u.text),['Perro']);
});
test('a preferred target voice cannot override the source-language voice',async()=>{
  const {run,spoken}=context(voices);
  await run("sourceLanguage='es';targetLanguage='ja';voicePreferences.ja='ja-JP';speakWord(GAMES[0][3][0])");
  assert.deepEqual(spoken.map(u=>u.lang),['es-ES','ja-JP']);
});
test('the final game returns home without claiming unplayed topics were completed',()=>{
  for(const completed of [false,true]){
    const {run,elements}=context();
    elements.game={classList:{add(){}}};elements.home={classList:{remove(){}}};
    elements.welcome={textContent:'',scrollIntoView(){}};
    run('renderHome=()=>{};gameIndex=19;step=3;correct=true');
    if(completed)run("explored.set(pairKey(),new Set(Array.from({length:80},(_,i)=>i)))");
    run('advanceLesson()');
    assert.equal(run('gameIndex'),-1);
    assert.equal(elements.welcome.textContent,run("ui('"+(completed?'completed':'good')+"')"));
  }
});
