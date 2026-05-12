const form = {
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    password: () => document.getElementById('password'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    recuperarSenhaButton: () => document.getElementById('recuperarSenha'),
    loginButton: () => document.getElementById('login-button'),
    registrarButton: () => document.getElementById('registrar'),
}

function validateFields() {
    togglebuttonsDisabled();
    toggleEmailErrors();
    togglePasswordErrors();
}

function isEmailValid() {
    const email = form.email().value;
    return !!email && validateEmail(email);
}

function login() {
    // Define a persistência como SESSION (o login expira ao fechar a aba/navegador)
    showloading();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            //hideloading();
            // Tenta o login com as credenciais fornecidas
            return firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value);
        })
        .then(() => {
            hideloading();
            // Sucesso: Senha correta
            window.location.href = "pages/home/home.html";
        })
        .catch(error => {
            hideloading();
            // CRÍTICO: Se a senha for inválida, forçamos o logout de qualquer sessão anterior
            firebase.auth().signOut();
            alert("Senha ou e-mail inválidos.");
            console.error('Erro de autenticação:', error);
        });
}
    
function register() {
    // Se o register.html é uma página protegida, não faz sentido ir para lá sem login.
    // Se for uma página de "Criar Conta", remova a proteção de Auth de dentro do register.html.

    //showloading();

    window.location.href = "pages/register/register.html";
}

function toggleEmailErrors() {
    const email = form.email().value;
    const emailRequiredError = form.emailRequiredError();
    const emailInvalidError = form.emailInvalidError();

    emailRequiredError.style.display = email ? "none" : "block";
    emailInvalidError.style.display = validateEmail(email) || !email ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    const passwordRequiredError = form.passwordRequiredError();
    passwordRequiredError.style.display = password ? "none" : "block";
}

function togglebuttonsDisabled() {
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    
    form.recuperarSenhaButton().disabled = !emailValid;
    form.loginButton().disabled = !emailValid || !passwordValid;
    // Se o registro for uma página pública para CRIAR conta, deixe false.
    // Se for uma página interna, use: form.registrarButton().disabled = !emailValid || !passwordValid;
}

function isPasswordValid() {
    const password = form.password().value;
    return !!password;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
    // A expressão regular /\S+@\S+\.\S+/ verifica se o email contém pelo menos um caractere antes do símbolo "@",
    // seguido por pelo menos um caractere, um ponto e pelo menos um caractere após o ponto.












    
