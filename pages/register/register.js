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
    const nomeInput = document.getElementById('reg-nome');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nome || !email || !password) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {
        // 1. Cria o usuário no Authentication (Login)
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Atualiza o perfil do Authentication (Nome de exibição)
        await user.updateProfile({
            displayName: nome
        });

        // 3. AGORA A MÁGICA: Salva os dados na coleção 'usuarios' do Firestore
        // Usamos .doc(user.uid) para que o ID do documento seja IGUAL ao ID do login.
        // Isso é fundamental para vincular o login ao perfil!
        await firebase.firestore().collection('usuarios').doc(user.uid).set({
            nome: nome,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
        });

        alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}`);
        window.location.href = "../../index.html"; 
        
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        if (error.code === 'auth/email-already-in-use') {
            alert("Este e-mail já está sendo utilizado.");
        } else {
            alert("Erro ao criar conta: " + error.message);
        }
    }
}


// Função para voltar à página anterior
function goBack() {
    window.location.href = "../../index.html";
}
