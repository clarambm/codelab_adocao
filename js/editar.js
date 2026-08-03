// js/editar.js
import { supabase } from './supabase.js';

// Protege a página: só quem estiver logado acessa
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname + window.location.search);
}

const NOME_BUCKET = 'fotos_animais'; 

const parametros = new URLSearchParams(window.location.search);
const idAnimal = parametros.get('id');

const form = document.getElementById('form-editar');
const btnSalvar = document.getElementById('btn-salvar');
const msgStatus = document.getElementById('msg-status');
const inputFoto = document.getElementById('foto');
const previewFoto = document.getElementById('preview-foto');

let fotoUrlAtual = '';

// Carrega os dados atuais do animal e preenche o formulário
async function carregarAnimal() {
  if (!idAnimal) {
    msgStatus.textContent = 'Animal não especificado.';
    msgStatus.classList.add('erro');
    return;
  }

  const { data, error } = await supabase.from('animais').select('*').eq('id', idAnimal).single();

  if (error || !data) {
    console.error('Erro ao carregar animal:', error);
    msgStatus.textContent = 'Animal não encontrado.';
    msgStatus.classList.add('erro');
    return;
  }

  document.getElementById('nome').value = data.nome ?? '';
  document.getElementById('especie').value = data.especie ?? '';
  document.getElementById('porte').value = data.porte ?? '';
  document.getElementById('sexo').value = data.sexo ?? '';
  document.getElementById('idade').value = data.idade ?? '';
  document.getElementById('descricao').value = data.descricao ?? '';

  fotoUrlAtual = data.foto_url ?? '';
  previewFoto.src = fotoUrlAtual;
}

// Preview da foto nova
inputFoto.addEventListener('change', () => {
  const arquivo = inputFoto.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (evento) => {
    previewFoto.src = evento.target.result;
  };
  leitor.readAsDataURL(arquivo);
});

// Salvar alterações 
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'SALVANDO...';
  msgStatus.textContent = '';
  msgStatus.className = 'msg-status';

  try {
    let fotoUrl = fotoUrlAtual;
    const arquivoNovaFoto = inputFoto.files[0];

    // Se escolheu uma foto nova, faz upload dela
    if (arquivoNovaFoto) {
      const nomeArquivo = `${Date.now()}-${arquivoNovaFoto.name}`;
      const { error: erroUpload } = await supabase.storage.from(NOME_BUCKET).upload(nomeArquivo, arquivoNovaFoto);

      if (erroUpload) throw new Error('Erro no upload da nova foto: ' + erroUpload.message);

      const { data: urlData } = supabase.storage.from(NOME_BUCKET).getPublicUrl(nomeArquivo);
      fotoUrl = urlData.publicUrl;
    }

    const { error: erroUpdate } = await supabase
      .from('animais')
      .update({
        nome: document.getElementById('nome').value.trim(),
        especie: document.getElementById('especie').value,
        porte: document.getElementById('porte').value,
        sexo: document.getElementById('sexo').value,
        idade: document.getElementById('idade').value,
        descricao: document.getElementById('descricao').value.trim(),
        foto_url: fotoUrl,
      })
      .eq('id', idAnimal);

    if (erroUpdate) throw new Error('Erro ao salvar alterações: ' + erroUpdate.message);

    msgStatus.textContent = 'Alterações salvas com sucesso!';
    msgStatus.classList.add('sucesso');

  } catch (erro) {
    console.error(erro);
    msgStatus.textContent = erro.message;
    msgStatus.classList.add('erro');

  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'SALVAR ALTERAÇÕES';
  }
});

carregarAnimal();