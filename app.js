const KEY='imds_social_v2_data';
const SESSION='imds_social_v2_session';
const defaultUsers=[{name:'Direction IMDS',phone:'0000000000',email:'direction@imds.local',password:'imds1234',role:'direction'}];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{users:defaultUsers}}catch(e){return{users:defaultUsers}}}
function save(data){localStorage.setItem(KEY,JSON.stringify(data))}
function setSession(user){localStorage.setItem(SESSION,JSON.stringify(user))}
function getSession(){try{return JSON.parse(localStorage.getItem(SESSION))}catch(e){return null}}

const authView=document.getElementById('authView'), dash=document.getElementById('dashboardView');
const logout=document.getElementById('logoutBtn'), msg=document.getElementById('authMsg');

function roleName(r){return ({direction:'Direction',professeur:'Professeur',eleve:'Élève',parent:'Parent'})[r]||r}
function showDashboard(user){
  authView.classList.add('hidden'); dash.classList.remove('hidden'); logout.classList.remove('hidden');
  document.getElementById('welcomeName').textContent='Bonjour, '+user.name;
  document.getElementById('roleLabel').textContent='Espace '+roleName(user.role);
  document.getElementById('roleBadge').textContent=roleName(user.role);
  showModule('accueil');
}
function showAuth(){dash.classList.add('hidden');authView.classList.remove('hidden');logout.classList.add('hidden')}

document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
 document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
 document.getElementById('loginForm').classList.toggle('hidden',t.dataset.tab!=='login');
 document.getElementById('registerForm').classList.toggle('hidden',t.dataset.tab!=='register');msg.textContent='';
});

document.getElementById('loginForm').onsubmit=e=>{
 e.preventDefault(); const d=load(), id=document.getElementById('loginId').value.trim().toLowerCase(), p=document.getElementById('loginPassword').value;
 const u=d.users.find(x=>(x.email||'').toLowerCase()===id||x.phone===id);
 if(u&&u.password===p){setSession(u);showDashboard(u);msg.textContent=''}else msg.textContent='Identifiants incorrects.';
};

document.getElementById('registerForm').onsubmit=e=>{
 e.preventDefault(); const d=load(); const user={name:regName.value.trim(),phone:regPhone.value.trim(),email:regEmail.value.trim(),password:regPassword.value,role:regRole.value};
 if(d.users.some(x=>x.phone===user.phone||(user.email&&x.email===user.email))){msg.textContent='Ce compte existe déjà.';return}
 d.users.push(user);save(d);setSession(user);showDashboard(user);
};

document.getElementById('demoBtn').onclick=()=>{
 const u={name:'Utilisateur Démo',phone:'demo',email:'demo@imds.local',role:'direction'};setSession(u);showDashboard(u);
};
logout.onclick=()=>{localStorage.removeItem(SESSION);showAuth()};

function showModule(m){
 const c=document.getElementById('content');
 const texts={
 accueil:['IMDS Social v2.0','Le cœur du système est prêt. Les modules en ligne seront ajoutés progressivement.'],
 profil:['Mon profil','Consulte et modifie les informations de ton compte.'],
 publications:['Publications','Le fil de publications synchronisées sera ajouté dans une prochaine étape.'],
 classes:['Classes','La gestion des classes sera ajoutée dans une prochaine étape.'],
 messages:['Messages','La messagerie sera ajoutée dans une prochaine étape.'],
 notifications:['Notifications','Les notifications seront ajoutées dans une prochaine étape.'],
 sauvegarde:['Sauvegarde locale','Les comptes et paramètres de base sont conservés dans le stockage local de cet appareil.']
 };
 const x=texts[m]||texts.accueil;c.innerHTML='<h3>'+x[0]+'</h3><p>'+x[1]+'</p>';
}
document.querySelectorAll('.tile').forEach(b=>b.onclick=()=>showModule(b.dataset.module));
const session=getSession(); if(session)showDashboard(session); else showAuth();
