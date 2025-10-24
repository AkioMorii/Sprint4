
$(document).ready(function () {
    $('#CPF').mask('000.000.000-00');
    $('#Telefone').mask('(00) 00000-0000');
});

function formatCPF(input) {
    
    let value;
    if(typeof(input)==='string'){
        value=input;
    }
    else{
        value=input.value;
    }
    value = value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
}

function formatTelefone(input) {
    var phone;
    if(typeof(input)==='string'){
        phone=input;
    }
    else{
        phone=input.value;
    }
    let value = phone.replace(/\D/g, '').slice(0, 11);
    console.log(value);
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    if(typeof(input)==='string'){
        return value;
    }
    else{
        input.value = value;
    }
}