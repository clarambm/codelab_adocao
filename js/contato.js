// js/contato.js
import { supabase } from './supabase.js';

const form = document.getElementById('form-contato');
const btnEnviar = document.getElementById('btn-enviar');
const msgStatus = document.getElementById('msg-status');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // impede o formulário de recarregar a página

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const assunto = document.getElementById('assunto').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  // Desabilita o botão pra evitar clique duplo enquanto envia
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'ENVIANDO...';
  msgStatus.textContent = '';
  msgStatus.className = 'msg-status';

  const { error } = await supabase
    .from('mensagens')
    .insert([{ nome, email, assunto, mensagem }]);

  btnEnviar.disabled = false;
  btnEnviar.textContent = 'ENVIAR';

  if (error) {
    console.error('Erro ao enviar mensagem:', error);
    msgStatus.textContent = 'Erro ao enviar. Tente novamente.';
    msgStatus.classList.add('erro');
    return;
  }

  msgStatus.textContent = 'Mensagem enviada com sucesso!';
  msgStatus.classList.add('sucesso');
  form.reset(); // limpa o formulário
});