/**
 * auth-guard.js
 * Protege páginas privadas e evita o efeito de "flash" de conteúdo não autorizado.
 */

function checkAuth() {
    // Esconde o corpo da página imediatamente para evitar que o usuário 
    // veja dados privados enquanto o Firebase verifica a sessão
    document.body.style.display = 'none';

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            console.log("Acesso negado. Redirecionando...");
            window.location.replace("../../index.html"); // .replace não deixa a página no histórico
        } else {
            console.log("Usuário autenticado.");
            document.body.style.display = 'flex'; // Mostra a página se estiver logado
            
            // Se a página for centralize, garante que o estilo de flex seja mantido
            if(document.body.classList.contains('centralize')) {
                document.body.style.display = 'flex';
            } else {
                document.body.style.display = 'block';
            }
        }
    });
}

checkAuth();
