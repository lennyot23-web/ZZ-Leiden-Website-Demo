(function(){
  // ---------- language ----------
  var els=document.querySelectorAll('[data-nl]');
  function setLang(lang){
    els.forEach(function(el){el.innerHTML=el.getAttribute('data-'+lang)});
    document.documentElement.lang=lang;
    var nl=document.getElementById('nl'),en=document.getElementById('en');
    if(nl)nl.classList.toggle('on',lang==='nl');
    if(en)en.classList.toggle('on',lang==='en');
    try{localStorage.setItem('zzlang',lang)}catch(e){}
    window.__lang=lang;
    if(window.renderFixtures)window.renderFixtures();
    if(window.onLang)window.onLang();
  }
  var saved='nl';try{saved=localStorage.getItem('zzlang')||'nl'}catch(e){}
  var nlb=document.getElementById('nl'),enb=document.getElementById('en');
  if(nlb)nlb.onclick=function(){setLang('nl')};
  if(enb)enb.onclick=function(){setLang('en')};

  // ---------- menu ----------
  var b=document.getElementById('burger'),l=document.getElementById('links');
  if(b&&l){b.onclick=function(){l.classList.toggle('open')};
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open')})});}

  // ---------- carousels ----------
  document.querySelectorAll('[data-scroll]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=document.getElementById(btn.getAttribute('data-target'));
      if(t)t.scrollBy({left:(btn.getAttribute('data-scroll')==='next'?1:-1)*t.clientWidth*0.8,behavior:'smooth'});
    });
  });

  setLang(saved);
})();

// ---------- fixtures (from the club's published schedule, BNXT League 2026/27) ----------
var FIXTURES=[
  ['2026-10-17T20:00','home','Partena Professional Okapi Aalst','Sportcomplex 1574, Leiden'],
  ['2026-10-24T20:30','away','AB InBev Leuven Bears','SportOase, Leuven'],
  ['2026-10-31T20:00','home','Donar Groningen','Sportcomplex 1574, Leiden'],
  ['2026-11-07T20:30','away','CityX Mons','Lotto Mons Arena, Mons'],
  ['2026-11-14T20:00','home','Coretec Oostende','Sportcomplex 1574, Leiden'],
  ['2026-11-21T20:30','away','Kangoeroes Basket Mechelen','De Nekker, Mechelen'],
  ['2026-12-04T20:30','away','CB Liège','Province Ballons Arena, Luik'],
  ['2026-12-12T20:00','home','Windrose Giants Antwerp','Sportcomplex 1574, Leiden'],
  ['2026-12-23T20:00','away','Heroes Den Bosch','De Maaspoort, Den Bosch'],
  ['2026-12-27T15:30','home','House of Talents Spurs Kortrijk','Sportcomplex 1574, Leiden'],
  ['2027-01-09T20:30','away','Val-Dieu Spirou Basket Charleroi','Spirou Dôme, Charleroi'],
  ['2027-01-17T14:00','away','Landstede Hammers Zwolle','Landstede Sportcentrum, Zwolle'],
  ['2027-01-23T20:00','home','Hubo Limburg United','Sportcomplex 1574, Leiden'],
  ['2027-01-27T20:30','away','Brussels Basketball','Neder-Over-Heembeek, Brussel'],
  ['2027-01-30T20:00','home','Zeeuw & Zeeuw Rotterdam City Basketball','Sportcomplex 1574, Leiden']
];
var DAYS={nl:['zo','ma','di','wo','do','vr','za'],en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
var MONTHS={nl:['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
function fmt(d,lang){return DAYS[lang][d.getDay()]+' '+d.getDate()+' '+MONTHS[lang][d.getMonth()]}
function hhmm(d){return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function upcoming(){var now=new Date();return FIXTURES.map(function(f){return {d:new Date(f[0]),side:f[1],opp:f[2],venue:f[3]}}).filter(function(f){return f.d.getTime()+2*3600e3>now.getTime()})}

window.renderFixtures=function(){
  var lang=window.__lang||'nl',list=upcoming();
  var row=document.getElementById('fixtures');
  if(row){
    row.innerHTML=list.map(function(f){
      var home=f.side==='home';
      var a=home?'ZZ Leiden':f.opp, b=home?f.opp:'ZZ Leiden';
      return '<article class="fx'+(home?' home':'')+'">'+
        '<div class="fx-top"><span>'+fmt(f.d,lang)+'</span><span class="fx-tag">'+(home?(lang==='nl'?'Thuis':'Home'):(lang==='nl'?'Uit':'Away'))+'</span></div>'+
        '<div class="fx-venue">'+f.venue+'</div>'+
        '<div class="fx-teams"><b'+(home?' class="us"':'')+'>'+a+'</b><span class="fx-time">'+hhmm(f.d)+'</span><b'+(!home?' class="us"':'')+'>'+b+'</b></div>'+
        '<div class="fx-actions">'+(home?'<a class="btn btn-lime btn-sm" href="#tickets">'+(lang==='nl'?'Tickets':'Tickets')+'</a>':'<a class="btn btn-ghost btn-sm" href="https://bnxt.tv" target="_blank" rel="noopener">'+(lang==='nl'?'Kijk live':'Watch live')+'</a>')+'</div>'+
      '</article>';
    }).join('');
  }
  var next=list[0], nx=document.getElementById('next');
  if(nx&&next){
    var home=next.side==='home';
    document.getElementById('next-a').textContent=home?'ZZ Leiden':next.opp;
    document.getElementById('next-b').textContent=home?next.opp:'ZZ Leiden';
    document.getElementById('next-meta').textContent=fmt(next.d,lang)+' · '+hhmm(next.d)+' · '+next.venue;
    window.__nextDate=next.d;
  }
};
(function tick(){
  var d=window.__nextDate,el=document.getElementById('countdown');
  if(d&&el){
    var s=Math.max(0,Math.floor((d-new Date())/1000));
    var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
    el.querySelectorAll('strong').forEach(function(n,i){n.textContent=('0'+v[i]).slice(-2)});
  }
  setTimeout(tick,1000);
})();
window.renderFixtures();
