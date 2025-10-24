const form = document.getElementById("loginForm");
const alertErro = document.getElementById("alertErro");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    alertErro.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {
    const response = await fetch(API_URL_Login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
        alertErro.style.display = "block";
        return;
    }

    const data = await response.json();
    console.log("Login bem-sucedido:", data);

    localStorage.setItem("token", data.token);
    window.location.href = "Contatos/index.html";

    } catch (error) {
    console.error("Erro ao conectar à API:", error);
    alertErro.style.display = "block";
    }
});