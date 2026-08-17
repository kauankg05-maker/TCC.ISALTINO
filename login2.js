// Protege a página - só acessa se estiver logado
protectPage();

// ========== TELAS ==========
function mostrar(tela) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(tela).classList.remove('hidden');
}

function voltarDashboard() {
  carregarPets();
  verificarAlertas();
  mostrar('dashboard-screen');
}

function mostrarFormPet() {
  ['nome','especie','raca','idade','sexo','documento','alergias','alimentacao','rotina','proximaConsulta']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  mostrar('form-pet-screen');
}

function mostrarUrgencia() {
  document.getElementById('status-geo').innerText = 'Aguardando localizacao...';
  document.getElementById('lista-gratis').innerHTML = '';
  document.getElementById('lista-pagos').innerHTML = '';
  mostrar('urgencia-screen');
}

// ========== PETS ==========
function getPets() {
  const user = localStorage.getItem('loggedUser') || 'default';
  const all = JSON.parse(localStorage.getItem('peturgencia_pets') || '{}');
  return all[user] || [];
}

function setPets(lista) {
  const user = localStorage.getItem('loggedUser') || 'default';
  const all = JSON.parse(localStorage.getItem('peturgencia_pets') || '{}');
  all[user] = lista;
  localStorage.setItem('peturgencia_pets', JSON.stringify(all));
}

function carregarPets() {
  const pets = getPets();
  const container = document.getElementById('lista-pets');

  if (pets.length === 0) {
    container.innerHTML = '<p class="vazio">Nenhum pet cadastrado ainda.<br>Clique em "+ Pet"</p>';
    return;
  }

  container.innerHTML = pets.map(p => `
    <div class="pet-card">
      <h3>${p.nome}</h3>
      <p>${p.especie || '-'} • ${p.sexo || '-'} • ${p.idade || '-'}</p>
      <p><strong>Documento:</strong> ${p.documento || '-'}</p>
      <p><strong>Alergias:</strong> ${p.alergias || 'Nenhuma'}</p>
      <p><strong>Alimentacao:</strong> ${p.alimentacao || '-'}</p>
      <p><strong>Proxima consulta:</strong> ${p.proximaConsulta || '-'}</p>
    </div>
  `).join('');
}

function salvarPet() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome) {
    alert('Nome do pet e obrigatorio');
    return;
  }

  const pet = {
    id: Date.now(),
    nome,
    especie: document.getElementById('especie').value.trim(),
    raca: document.getElementById('raca').value.trim(),
    idade: document.getElementById('idade').value.trim(),
    sexo: document.getElementById('sexo').value,
    documento: document.getElementById('documento').value.trim(),
    alergias: document.getElementById('alergias').value.trim(),
    alimentacao: document.getElementById('alimentacao').value.trim(),
    rotina: document.getElementById('rotina').value.trim(),
    proximaConsulta: document.getElementById('proximaConsulta').value
  };

  const pets = getPets();
  pets.push(pet);
  setPets(pets);
  voltarDashboard();
}

// ========== QR CODE (CAMERA) ==========
let html5QrCode = null;

function iniciarScanner() {
  const reader = document.getElementById('qr-reader');
  const btnParar = document.getElementById('btn-parar');

  reader.style.display = 'block';
  btnParar.style.display = 'inline-block';

  html5QrCode = new Html5Qrcode("qr-reader");

  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      document.getElementById('documento').value = decodedText;
      pararScanner();
      alert('QR Code lido:\n' + decodedText);
    },
    (errorMessage) => {
      // ignora erros de leitura
    }
  ).catch(err => {
    alert('Erro ao abrir a camera: ' + err);
    reader.style.display = 'none';
    btnParar.style.display = 'none';
  });
}

function pararScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      document.getElementById('qr-reader').style.display = 'none';
      document.getElementById('btn-parar').style.display = 'none';
    }).catch(err => {
      console.error('Erro ao parar camera:', err);
    });
  }
}

// ========== ALERTAS ==========
function verificarAlertas() {
  const pets = getPets();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alertas = [];

  pets.forEach(p => {
    if (!p.proximaConsulta) return;
    const data = new Date(p.proximaConsulta + 'T00:00:00');
    const diff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff <= 7) {
      alertas.push(p.nome + ': consulta em ' + diff + ' dia(s)');
    }
  });

  const el = document.getElementById('alertas');
  el.innerHTML = alertas.length
    ? '<div class="alerta">' + alertas.join(' | ') + '</div>'
    : '';
}

// ========== URGENCIA ==========
function buscarVets() {
  const status = document.getElementById('status-geo');
  status.innerText = 'Obtendo localizacao...';

  if (!navigator.geolocation) {
    status.innerText = 'Geolocalizacao nao suportada';
    mostrarVetsMock();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      status.innerText = 'Localizacao: ' + latitude.toFixed(5) + ', ' + longitude.toFixed(5);
      mostrarVetsMock();
    },
    () => {
      status.innerText = 'Nao foi possivel obter localizacao. Mostrando lista padrao.';
      mostrarVetsMock();
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function mostrarVetsMock() {
  const vets = [
    { nome: 'Clinica Popular Zona Norte', gratuito: true, dist: 1.2, tel: '(11) 3456-7890' },
    { nome: 'ONG Amigos dos Animais', gratuito: true, dist: 2.5, tel: '(11) 9876-5432' },
    { nome: 'Posto de Saude Animal', gratuito: true, dist: 3.8, tel: '(11) 2345-6789' },
    { nome: 'Vet 24h Centro', gratuito: false, dist: 0.9, tel: '(11) 9999-1122' },
    { nome: 'PetCare Particular', gratuito: false, dist: 1.7, tel: '(11) 9888-3344' },
    { nome: 'Hospital Veterinario Sul', gratuito: false, dist: 4.2, tel: '(11) 9777-5566' }
  ];

  const gratis = vets.filter(v => v.gratuito).sort((a, b) => a.dist - b.dist);
  const pagos  = vets.filter(v => !v.gratuito).sort((a, b) => a.dist - b.dist);

  renderVets('lista-gratis', gratis);
  renderVets('lista-pagos', pagos);
}

function renderVets(id, lista) {
  document.getElementById(id).innerHTML = lista.map(v => `
    <div class="vet-card">
      <strong>${v.nome}</strong><br>
      ${v.dist} km • ${v.tel}<br>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.nome)}" target="_blank">
        Abrir rota
      </a>
    </div>
  `).join('');
}

// ========== INICIO ==========
window.onload = function() {
  carregarPets();
  verificarAlertas();
};
