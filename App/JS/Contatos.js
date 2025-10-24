var filter = document.getElementById("search");
filter.addEventListener('click', function(){
    var content = document.getElementById("filtroNome").value
    if(content != ""){
        List(content)
    }else{
        List()
    }
});

async function ValidateSubmit(event, methodName) {
    event.preventDefault();
    const fields = [
        { id: "Name", message: "Nome em branco" },
        { id: "Nickname", message: "Apelido em branco" },
        { id: "Email", message: "Email em branco" },
        { id: "Phone", message: "Telefone em branco" },
        { id: "CPF", message: "CPF em branco" }
    ];
    if (!ValidateFields(fields)) {
        return false;
    }
    var Id;
    if (methodName == 'edit') {
        Id = document.getElementById("Id").value; // Obtém o ID da URL
        methodName +="/"+Id;
    }

    try {
        var Nome= document.getElementById("Name").value;
        var Apelido= document.getElementById("Nickname").value;
        var Email= document.getElementById("Email").value;
        var Telefone= document.getElementById("Phone").value;
        var CPF= document.getElementById("CPF").value; 
        var data= JSON.stringify({Id, Nome,Apelido,Email,Telefone,CPF});
        const response = await submitSave(API_URL +"Agenda/" + methodName, 'POST', data);
        alert('Usuario criado com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error)
        console.log(error)
        console.error("Erro ao chamar API:", error);
    }

    return false;
}

async function GetOne() {
    var id
    id=localStorage.getItem('Id');
    if (id) {
        const dados = await CallAPI(`${API_URL}Agenda/GetOne/${id}`, 'GET');
        
        // Preencher os campos de edição com os dados
        document.getElementById("Id").value = id;
        document.getElementById("Name").value = dados.nome;
        document.getElementById("Nickname").value = dados.apelido;
        document.getElementById("Email").value = dados.email;
        document.getElementById("Phone").value = formatTelefone(dados.telefone);
        document.getElementById("CPF").value = formatCPF(dados.cpf);
    } else {
        alert("ID não encontrado!");
    }
}
async function Delete(){
    var id=localStorage.getItem('Id');
    CallAPI(`${API_URL}Agenda/delete/${id}`, "POST").then(function(ret){
        alert("Contato Excluido")
        window.location.href="index.html"
    });
}

async function List(content = "") {
    var url;
    if (content == ""){
        url = API_URL+"agenda/list"
    }
    else{
        url = API_URL+"agenda/list?filtroNome=" + content;
    }
    var dados= CallAPI(url, "GET").then(function(dados){
    const tbody = document.getElementById('dadosPessoais'); // Seleciona o tbody
        tbody.innerHTML = '';
        dados.forEach(dado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${dado.nome}</td>
            <td>${dado.apelido}</td>
            <td>${dado.telefone}</td>
            <td>${dado.email}</td>
            <td>${formatTimestamp(dado.dataCadastro)}</td>
            <td>
                <a href="#" onclick="Redirect(${dado.id}, 'Edit.html')" class="btn btn-sm editButton">Editar</a> |
                <a href="#" onclick= "Redirect(${dado.id}, 'Delete.html')" class="btn btn-sm dltButton">Excluir</a>
            </td>
            `;
            tbody.appendChild(tr);
        });
    })
   
}

function getIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');  // Retorna o valor do parâmetro 'id'
}

function ValidateFields(fields) {
    let isValid = true;

    fields.forEach(field => {
        let value = document.getElementById(field.id).value;
        let errorElement = document.getElementById(`error-${field.id}`);

        if (!value || value.trim() === "") {
            errorElement.innerHTML = field.message;
            isValid = false;
        } else {
            errorElement.innerHTML = "";

            if (field.id === "CPF" && !CPFvalidate(value)) {
                errorElement.innerHTML = "CPF invalido";
                isValid = false;
            }

            if(field.id == "Phone" && !PhoneValidate(value)){
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

// Função para chamar API
async function CallAPI(URL, Method) {
console.log("URL",URL)
    try {
        const response = await fetch(URL, {
            method: Method,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
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
async function Report() {
        // Chamada à API para pegar os dados
        var dados= CallAPI(API_URL+"Agenda/list", "GET").then(function(dados){
            // Preenche a tabela com os dados recebidos
            const tabelaRelatorio = document.getElementById("tabela-relatorio");
            tabelaRelatorio.innerHTML = ''; // Limpa a tabela antes de preencher

            dados.forEach(dado => {
            const tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td>${dado.nome}</td>
            <td>${dado.apelido}</td>
            <td>${dado.telefone}</td>
            <td>${dado.email}</td>
            `;
                tabelaRelatorio.appendChild(tr);
            });
        });
}