function verificarLogin() {
  const token = localStorage.getItem("token");

  // Se não houver token, volta para a tela de login
  if (!token) {
    window.location.href = "../login.html";
    return false;
  }
  
  return true;
}