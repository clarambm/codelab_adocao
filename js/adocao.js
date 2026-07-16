// js/adocao.js
import { supabase } from './supabase.js';

const listaAnimais = document.getElementById('lista-animais');
const btnFiltro = document.getElementById('btn-filtro');
const painelFiltro = document.getElementById('painel-filtro');
const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro');
const inputBusca = document.getElementById('busca');

const filtroPorte = document.getElementById('filtro-porte');
const filtroSexo = document.getElementById('filtro-sexo');
const filtroEspecie = document.getElementById('filtro-especie');
const filtroIdade = document.getElementById('filtro-idade');

// Mostrar/esconder o filtro
btnFiltro.addEventListener('click', () => {
  painelFiltro.classList.toggle('escondido');
});

// --- Buscar animais, aplicando filtros ---
async function buscarAnimais(filtros = {}) {
  let query = supabase.from('animais').select('*');

  if (filtros.especie) query = query.eq('especie', filtros.especie);
  if (filtros.porte) query = query.eq('porte', filtros.porte);
  if (filtros.sexo) query = query.eq('sexo', filtros.sexo);
  if (filtros.idade) query = query.eq('idade', filtros.idade);
  if (filtros.busca) query = query.ilike('nome', `%${filtros.busca}%`);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar animais:', error);
    return [];
  }

  return data;
}

//Pegar os valores atuais dos filtros na tela
function pegarFiltrosAtuais() {
  return {
    porte: filtroPorte.value,
    sexo: filtroSexo.value,
    especie: filtroEspecie.value,
    idade: filtroIdade.value,
    busca: inputBusca.value.trim(),
  };
}

// Renderizar 
function renderizarAnimais(animais) {
  if (animais.length === 0) {
    listaAnimais.innerHTML = '<p class="vazio">Nenhum animal encontrado com esse filtro.</p>';
    return;
  }

  listaAnimais.innerHTML = animais.map(animal => `
    <div class="card-animal">
      <img src="${animal.foto_url}" alt="${animal.nome}">
      <h3>${animal.nome}</h3>
      <button class="btn-detalhes" data-id="${animal.id}">Ver Mais Detalhes</button>
    </div>
  `).join('');
}

// busca + renderiza 
async function atualizarLista(filtros = {}) {
  listaAnimais.innerHTML = '<p class="carregando">Carregando animais...</p>';
  const animais = await buscarAnimais(filtros);
  renderizarAnimais(animais);
}


// Clicar em "APLICAR" no painel de filtro
btnAplicarFiltro.addEventListener('click', () => {
  const filtros = pegarFiltrosAtuais();
  atualizarLista(filtros);
  painelFiltro.classList.add('escondido'); // fecha o painel depois de aplicar
});

// Buscar por nome enquanto digita (com um pequeno delay pra não buscar a cada letra)
let timeoutBusca;
inputBusca.addEventListener('input', () => {
  clearTimeout(timeoutBusca);
  timeoutBusca = setTimeout(() => {
    const filtros = pegarFiltrosAtuais();
    atualizarLista(filtros);
  }, 400); // espera 400ms depois de parar de digitar
});

// Carrega todos os animais assim que a página abre
atualizarLista();