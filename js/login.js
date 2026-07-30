// js/login.js
import { supabase } from './supabase.js';

const form = document.getElementById('form-login');
const btnLogin = document.getElementById('btn-login');
const msgStatus = document.getElementById('msg-status');

// Se já estiver logado, manda direto pro cadastro
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  window.location.href = 'cadastro.html';
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  btnLogin.disabled = true;
  btnLogin.textContent = 'ENTRANDO...';
  msgStatus.textContent = '';
  msgStatus.className = 'msg-status';

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    console.error('Erro no login:', error);
    msgStatus.textContent = 'Email ou senha incorretos.';
    msgStatus.classList.add('erro');
    btnLogin.disabled = false;
    btnLogin.textContent = 'ENTRAR';
    return;
  }

  // Login certo: redireciona pra área de cadastro
  window.location.href = 'cadastro.html';
});