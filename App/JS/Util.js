verificarLogin();
function PhoneValidate(phone) {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(phone);
}

function EmailValidate(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
}

function CPFvalidate(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (!/^\d{11}$/.test(cpf)) return false;

  // Elimina CPFs inválidos conhecidos (todos os dígitos iguais)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida os dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  if (digito2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}
function formatTimestamp(timestamp) {
    // Cria um objeto Date com o timestamp
    const date = new Date(timestamp);

    // Extrai as horas, minutos e segundos
     const day = date.getDate();       // Dia do mês
    const month = date.getMonth() + 1; // Mês (getMonth() retorna 0 para janeiro, por isso somamos 1)
    const year = date.getFullYear();  // Ano com 4 dígitos

    // Formata para 2 dígitos no caso de o dia ou mês ser menor que 10
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedDate;
}
function Redirect(id, Pagina){
    localStorage.setItem('Id', id);
    window.location.href = Pagina; // Redireciona para a outra página
}
function Logoff(){
  alert("Saindo..."); // Teste visual
  localStorage.removeItem("token");
  window.location.href = "../Login.html";
}