var filter = document.getElementById("search");
filter.addEventListener('click', function(){
    var content = document.getElementById("filtroNome").value
    if(content != ""){
        List(content)
    }else{
        List()
    }
});
function submitSave(url,method,data) {
    console.log("url",url)
    console.log("method",method)
    console.log("data",data)
    return new Promise(function(resolve, reject){
        fetch(url, {
            method: method, 
            headers: {'Content-Type': 'application/json'},
            body:data
        }).then(res => {
            if (res.status === 200) {
                resolve(res);
            } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + res.status + ']'));
            }
        });
    });
}
async function List(content = "") {
    var url;
    if (content == ""){
        url = API_URL+"usuario/list"
    }
    else{
        url = API_URL+"usuario/list?filtroNome=" + content;
    }
    var dados= CallAPI(url, "GET").then(function(dados){
    const tbody = document.getElementById('dadosPessoais'); // Seleciona o tbody
        tbody.innerHTML = '';
        console.log(dados);
        dados.forEach(dado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${dado.nome}</td>
            <td>${dado.login}</td>
            <td>${dado.telefone}</td>
            <td>${dado.email}</td>
            <td>${formatTimestamp(dado.dataCadastro)}</td>
            <td>
                <a href="#" onclick="Redirect(${dado.usuario_id}, 'Edit.html')" class="btn btn-sm editButton">Editar</a> |
                <a href="#" onclick= "Redirect(${dado.usuario_id}, 'Delete.html')" class="btn btn-sm dltButton">Excluir</a>
            </td>
            `;
            tbody.appendChild(tr);
        });
    })
   
}
async function CallAPI(URL, Method) {
console.log("URL",URL)
    try {
        const response = await fetch(URL, {
            method: Method,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                return data;
            }
            return true;

        } else {
            console.error("Erro na requisição:", response.status);
        }
    } catch (error) {
        console.error("Erro na chamada fetch:", error);
    }

    return false;
}
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

async function ValidateSubmit(event, methodName) {
    event.preventDefault();
    let fields=[];
    if(methodName=="create"){
        fields = [
            { id: "Nome", message: "Nome em branco" },
            { id: "Login", message: "Login em branco" },
            { id: "Email", message: "Email em branco" },
            { id: "Telefone", message: "Telefone em branco" },
            { id: "Senha", message: "Senha em branco" },
            { id: "ConfirmarSenha", message: "Confirmar Senha em branco" }
        ];
    }else{
        fields = [
            { id: "Nome", message: "Nome em branco" },
            { id: "Login", message: "Login em branco" },
            { id: "Email", message: "Email em branco" },
            { id: "Telefone", message: "Telefone em branco" }
        ];
    }
    if (!ValidateFields(fields)) {
        return false;
    }
    if(methodName=="create"){
        const senha = document.getElementById("Senha").value;
        const confirmar = document.getElementById("ConfirmarSenha").value;
        const errorConfirmar = document.getElementById("error-ConfirmarSenha");

        if (senha !== confirmar) {
            errorConfirmar.textContent = "As senhas não coincidem.";
            return false;
        } else {
            errorConfirmar.textContent = "";
        }
    }
    var Usuario_id;
    if (methodName == 'edit') {
        Usuario_id = document.getElementById("Usuario_id").value; // Obtém o ID da URL
        methodName +="/"+Usuario_id;
    }

    try {
        var Nome= document.getElementById("Nome").value;
        var Login= document.getElementById("Login").value;
        var Email= document.getElementById("Email").value;
        var Telefone= document.getElementById("Telefone").value;
        if(methodName=="create"){
            var Senha= document.getElementById("Senha").value; 
            var ConfirmarSenha= document.getElementById("ConfirmarSenha").value; 
        }
        var data= JSON.stringify({Usuario_id, Nome,Login,Email,Telefone,Senha,ConfirmarSenha});
        var url = API_URL + "Usuario/"
        const response = await submitSave(url + methodName, 'POST', data);
        alert('Usuario criado com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Erro ao chamar API:", error);
    }

    return false;
}
function ValidateFields(fields) {
    console.log('fields',fields);
    let isValid = true;

    fields.forEach(field => {
        console.log(field.id)
        let value = document.getElementById(field.id).value;
        let errorElement = document.getElementById(`error-${field.id}`);

        if (!value || value.trim() === "") {
            errorElement.innerHTML = field.message;
            isValid = false;
        } else {
            errorElement.innerHTML = "";

            if(field.id == "Telefone" && !PhoneValidate(value)){
                errorElement.innerHTML = "Telefone invalido"
                isValid = false;
            }

            if(field.id == "Email" && !EmailValidate(value)){
                errorElement.innerHTML = "Email invalido"
                isValid = false;
            }
        }
    });

    return isValid;
}
async function GetOne() {
    var id
    id=localStorage.getItem('Id');
    if (id) {
        const dados = await CallAPI(`${API_URL}Usuario/GetOne/${id}`, 'GET');
        console.log(dados);
        document.getElementById("Usuario_id").value = id;
        document.getElementById("Nome").value = dados.nome;
        document.getElementById("Login").value = dados.login;
        document.getElementById("Email").value = dados.email;
        document.getElementById("Telefone").value = formatTelefone(dados.telefone);
    } else {
        alert("ID não encontrado!");
    }
}
async function Delete(){
    var id=localStorage.getItem('Id');
    CallAPI(`${API_URL}Usuario/delete/${id}`, "POST").then(function(ret){
        alert("Usuario Excluido")
        window.location.href="index.html"
    });
}