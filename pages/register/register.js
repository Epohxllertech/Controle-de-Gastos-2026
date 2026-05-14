/**
 * register.js
 * Lógica de registro de usuários para o Sistema de Controle de Gastos
 */

// Função para validar ou processar mudanças no e-mail (chamada pelo onchange no HTML)
function onChangeEmail() {
    const email = document.getElementById('reg-email').value;
    console.log("E-mail alterado para: " + email);
    // Aqui você poderia adicionar uma validação de formato de e-mail em tempo real
}

// Função principal para criar a conta
async function handleRegister() {
    // Captura dos elementos do DOM
    const nomeInput = document.getElementById('reg-nome');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 1. Validação básica de campos vazios
    if (!nome || !email || !password) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // 2. Validação mínima de senha (ex: 6 caracteres, exigência do Firebase)
    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {
        // 3. Criação do usuário no Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // 4. Salvando o Nome do usuário no perfil do Firebase
        // O createUserWithEmailAndPassword não salva o nome, apenas email e senha.
        // Usamos o updateProfile para salvar o nome exibido.
        await userCredential.user.updateProfile({
            displayName: nome
        });

        alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}`);
        
        // Redireciona para a página de login/index
        window.location.href = "../../index.html"; 
        
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        
        // Tratamento de erros comuns do Firebase
        if (error.code === 'auth/email-already-in-use') {
            alert("Este e-mail já está sendo utilizado por outra conta.");
        } else if (error.code === 'auth/invalid-email') {
            alert("O e-mail digitado é inválido.");
        } else if (error.code === 'auth/weak-password') {
            alert("A senha escolhida é muito fraca.");
        } else {
            alert("Erro ao criar conta: " + error.message);
        }
    }
}

// Função para voltar à página anterior
function goBack() {
    window.location.href = "../../index.html";
}
