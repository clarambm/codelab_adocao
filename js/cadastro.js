// js/cadastro.js
import { supabase } from './supabase.js';

const NOME_BUCKET = 'fotos_animais';

const form = document.getElementById('form-cadastro');
const btnCadastrar = document.getElementById('btn-cadastrar');
const msgStatus = document.getElementById('msg-status');
const inputFoto = document.getElementById('foto');
const previewFoto = document.getElementById('preview-foto');

//Mostrar preview da imagem assim que o usuário escolhe o arquivo
inputFoto.addEventListener('change', () => {
  const arquivo = inputFoto.files[0];
  if (!arquivo) {
    previewFoto.classList.add('escondido');
    return;
  }

  const leitor = new FileReader();
  leitor.onload = (evento) => {
    previewFoto.src = evento.target.result;
    previewFoto.classList.remove('escondido');
  };
  leitor.readAsDataURL(arquivo);
});

//Envio do formulário
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const especie = document.getElementById('especie').value;
  const porte = document.getElementById('porte').value;
  const sexo = document.getElementById('sexo').value;
  const idade = document.getElementById('idade').value;
  const arquivoFoto = inputFoto.files[0];

  if (!arquivoFoto) {
    msgStatus.textContent = 'Selecione uma foto.';
    msgStatus.className = 'msg-status erro';
    return;
  }

  btnCadastrar.disabled = true;
  btnCadastrar.textContent = 'ENVIANDO...';
  msgStatus.textContent = '';
  msgStatus.className = 'msg-status';

  try {
    //Faz upload da foto pro Storage
    // Nome único pro arquivo, pra não sobrescrever fotos de nomes iguais
    const nomeArquivo = `${Date.now()}-${arquivoFoto.name}`;

    const { error: erroUpload } = await supabase
      .storage
      .from(NOME_BUCKET)
      .upload(nomeArquivo, arquivoFoto);

    if (erroUpload) {
      throw new Error('Erro no upload da foto: ' + erroUpload.message);
    }

    //Pega a URL pública da foto que acabou de subir
    const { data: urlData } = supabase
      .storage
      .from(NOME_BUCKET)
      .getPublicUrl(nomeArquivo);

    const fotoUrl = urlData.publicUrl;

    //Insere o animal na tabela
    const { error: erroInsert } = await supabase
      .from('animais')
      .insert([{
        nome,
        especie,
        porte,
        sexo,
        idade,
        foto_url: fotoUrl,
      }]);

    if (erroInsert) {
      throw new Error('Erro ao salvar animal: ' + erroInsert.message);
    }

    // Ação efetuada
    msgStatus.textContent = 'Animal cadastrado com sucesso!';
    msgStatus.classList.add('sucesso');
    form.reset();
    previewFoto.classList.add('escondido');

  } catch (erro) {
    console.error(erro);
    msgStatus.textContent = erro.message;
    msgStatus.classList.add('erro');

  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.textContent = 'CADASTRAR';
  }
});