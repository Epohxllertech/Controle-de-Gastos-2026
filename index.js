/**
 * index.js - Lógica de Autenticação de Login
 */

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    showloading(); // Ativa o loading do loading.js

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        alert("Login realizado com sucesso!");
        //window.location.href = "home.html"; // Ajuste o caminho conforme sua pasta
        //window.location.href = "pages/home";
        window.location.href = "pages/home/home.html";



    } catch (error) {
        console.error("Erro ao logar:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert("E-mail ou senha incorretos.");
        } else {
            alert("Erro ao entrar: " + error.message);
        }
    } finally {
        hideloading(); // Desativa o loading
    }
}

function recoverPassword() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert("Digite seu e-mail para recuperar a senha.");
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("E-mail de recuperação enviado!");
        })
        .catch((error) => {
            alert("Erro ao enviar e-mail: " + error.message);
        });
}

// Integração com o validations.js
function validateFields() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-button');
    const recoverBtn = document.getElementById('recuperarSenha');

    const isEmailValid = validateEmail(email); // Vem do validations.js

    // Mostrar/Esconder erros de e-mail
    document.getElementById('email-required-error').style.display = email ? 'none' : 'block';
    document.getElementById('email-invalid-error').style.display = (email && !isEmailValid) ? 'block' : 'none';
    document.getElementById('password-required-error').style.display = password ? 'none' : 'block';

    // Habilita botões apenas se os campos básicos estiverem preenchidos
    loginBtn.disabled = !(isEmailValid && password);
    recoverBtn.disabled = !isEmailValid;
}
/**
 * Função para redirecionar o usuário da página de Login 
 * para a página de Registro
 */
function register() {
    // Aqui usamos o mesmo conceito do caminho da home.
    // Se a sua home está em pages/home/home.html, 
    // provavelmente o registro está em pages/register/register.html
    
    window.location.href = "pages/register/register.html"; 
}
function logout() {
    firebase.auth().signOut().then(() => {
        alert("Sessão encerrada com sucesso!");
        window.location.replace("../../index.html"); 
    });
}


