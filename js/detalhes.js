// js/detalhes.js
import { supabase } from './supabase.js';

const container = document.getElementById('detalhe-animal');

// Pega o "id" do final da URL
const parametros = new URLSearchParams(window.location.search);
const idAnimal = parametros.get('id');

const legendas = {
  porte: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' },
  sexo: { macho: 'Macho', femea: 'Fêmea' },
  especie: { cachorro: 'Cachorro', gato: 'Gato' },
  idade: { filhote: 'Filhote', adulto: 'Adulto', idoso: 'Idoso' },
};

async function carregarAnimal() {
  // Se não veio nenhum id na URL, nem tenta buscar
  if (!idAnimal) {
    container.innerHTML = '<p class="vazio">Animal não especificado.</p>';
    return;
  }

  const { data, error } = await supabase
    .from('animais')
    .select('*')
    .eq('id', idAnimal)
    .single(); // exatamente 1 resultado

  if (error || !data) {
    console.error('Erro ao buscar animal:', error);
    container.innerHTML = '<p class="vazio">Animal não encontrado.</p>';
    return;
  }

  renderizarAnimal(data);
}

function renderizarAnimal(animal) {
  container.innerHTML = `
    <div class="detalhe-card">
      <img src="${animal.foto_url}" alt="${animal.nome}" class="detalhe-foto">

      <div class="detalhe-info">
        <h1>${animal.nome}</h1>

        <ul class="detalhe-lista">
          <li><strong>Espécie:</strong> ${legendas.especie[animal.especie] ?? animal.especie}</li>
          <li><strong>Porte:</strong> ${legendas.porte[animal.porte] ?? animal.porte}</li>
          <li><strong>Sexo:</strong> ${legendas.sexo[animal.sexo] ?? animal.sexo}</li>
          <li><strong>Idade:</strong> ${legendas.idade[animal.idade] ?? animal.idade}</li>
        </ul>

        ${animal.descricao ? `<p class="detalhe-descricao">${animal.descricao}</p>` : ''}

        <a href="contato.html" class="btn-cta">Quero adotar!</a>
      </div>
    </div>
  `;
}

carregarAnimal();