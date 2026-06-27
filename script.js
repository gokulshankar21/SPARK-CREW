/* Spark Crew — shared script */

/* HERO PARTICLE BACKGROUND (only runs if #particles canvas exists on the page) */
(function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -999, y: -999 };

  function resize(){ W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  function Node(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.35; this.vy = (Math.random()-.5)*.35;
    this.r = Math.random()*1.8+.8;
  }
  Node.prototype.update = function(){
    this.x += this.vx; this.y += this.vy;
    if(this.x<0||this.x>W) this.vx*=-1;
    if(this.y<0||this.y>H) this.vy*=-1;
  };
  function init(){ resize(); nodes=[]; const n=Math.min(90,Math.floor((W*H)/10000)); for(let i=0;i<n;i++) nodes.push(new Node()); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<nodes.length;i++){
      nodes[i].update();
      ctx.beginPath(); ctx.arc(nodes[i].x,nodes[i].y,nodes[i].r,0,Math.PI*2);
      ctx.fillStyle='#0071e3'; ctx.globalAlpha=0.35; ctx.fill(); ctx.globalAlpha=1;
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle='#0071e3'; ctx.globalAlpha=(1-d/140)*0.12; ctx.lineWidth=.7; ctx.stroke(); ctx.globalAlpha=1; }
      }
      const mx=nodes[i].x-mouse.x, my=nodes[i].y-mouse.y, md=Math.sqrt(mx*mx+my*my);
      if(md<180){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(mouse.x,mouse.y); ctx.strokeStyle='#0071e3'; ctx.globalAlpha=(1-md/180)*0.28; ctx.lineWidth=.8; ctx.stroke(); ctx.globalAlpha=1; }
    }
    requestAnimationFrame(draw);
  }
  canvas.addEventListener('mousemove', e=>{ const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
  canvas.addEventListener('mouseleave', ()=>{ mouse.x=-999; mouse.y=-999; });
  window.addEventListener('resize', init);
  init(); draw();
})();

/* SCROLL REVEAL */
(function initReveal(){
  const reveals = document.querySelectorAll('.reveal');
  if(!reveals.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
  reveals.forEach(el=>obs.observe(el));
})();

/* BOOK-A-CALL MODAL (index.html only) */
function openBookModal(){ const m=document.getElementById('bookModal'); if(m) m.classList.add('open'); }
function closeBookModal(){ const m=document.getElementById('bookModal'); if(m) m.classList.remove('open'); }

/* ---------------------------------------------------------------- */
/* AUTH FORM LOGIC — shared by login.html and signup.html           */
/* Each page only has the form relevant to it, so the functions      */
/* below check for element existence before acting.                  */
/* ---------------------------------------------------------------- */

function clearAuthErrors(){
  document.querySelectorAll('.field-input').forEach(el=>el.classList.remove('invalid'));
  document.querySelectorAll('.field-error').forEach(el=>el.style.display='none');
}
function showFieldError(inputId, errorId, show){
  const input=document.getElementById(inputId), err=document.getElementById(errorId);
  if(input&&err){ input.classList.toggle('invalid',show); err.style.display=show?'block':'none'; }
}
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function showAuthSuccess(title, text){
  const forms = document.getElementById('authForms');
  const success = document.getElementById('authSuccess');
  if(forms) forms.style.display='none';
  if(success){
    document.getElementById('authSuccessTitle').textContent = title;
    document.getElementById('authSuccessText').textContent = text;
    success.classList.add('active');
  }
}

function handleLoginSubmit(event){
  event.preventDefault();
  clearAuthErrors();
  let valid = true;

  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if(!isValidEmail(email)){ showFieldError('loginEmail','loginEmailError',true); valid=false; }
  if(pass.length<6){ showFieldError('loginPassword','loginPasswordError',true); valid=false; }
  if(!valid) return false;

  /* Front-end only demo: replace this block with a real API call, e.g.
     fetch('/api/login',{method:'POST',body:JSON.stringify({email,password:pass})}) */
  showAuthSuccess('Welcome back!', "You've been logged in successfully.");
  return false;
}

function handleSignupSubmit(event){
  event.preventDefault();
  clearAuthErrors();
  let valid = true;

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPassword').value;
  const terms = document.getElementById('signupTerms').checked;
  if(!name){ showFieldError('signupName','signupNameError',true); valid=false; }
  if(!isValidEmail(email)){ showFieldError('signupEmail','signupEmailError',true); valid=false; }
  if(pass.length<6){ showFieldError('signupPassword','signupPasswordError',true); valid=false; }
  if(!terms){ alert('Please agree to the Terms & Privacy Policy to continue.'); valid=false; }
  if(!valid) return false;

  /* Front-end only demo: replace this block with a real API call, e.g.
     fetch('/api/signup',{method:'POST',body:JSON.stringify({name,email,password:pass})}) */
  showAuthSuccess("You're in!", 'Welcome to Spark Crew, ' + name.split(' ')[0] + ". We're glad to have you.");
  return false;
}
