
function validateEmail(email) {// Função para validar o formato do email usando uma expressão regular simples
    return /\S+@\S+\.\S+/.test(email);
}

