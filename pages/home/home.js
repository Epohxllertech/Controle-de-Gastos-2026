/**
 * home.js
 * Lógica de transações financeiras com Firebase Firestore
 */

// Inicializa a escuta de dados assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});

// Função para salvar a transação no Firestore
async function saveTransaction() {
    // 1. Captura dos elementos do formulário
    const descInput = document.getElementById('trans-desc');
    const valorInput = document.getElementById('trans-valor');
    const tipoInput = document.getElementById('trans-tipo');
    const catInput = document.getElementById('trans-cat');

    const descricao = descInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const tipo = tipoInput.value;
    const categoria = catInput.value;

    // 2. Validação básica
    if (!descricao || isNaN(valor)) {
        alert("Por favor, preencha a descrição e o valor corretamente!");
        return;
    }

    // 3. Obter o usuário logado para vincular o gasto a ele
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Erro: Você precisa estar logado para salvar transações.");
        return;
    }

    try {
        // Mostra o loading (se você tiver o arquivo loading.js importado)
        if (typeof showloading === "function") showloading();

        // 4. Salvar no Firestore na coleção 'transacoes'
        await firebase.firestore().collection('transacoes').add({
            descricao: descricao,
            valor: valor,
            tipo: tipo,
            categoria: categoria,
            userId: user.uid, // Vincula o documento ao ID único do usuário
            data: firebase.firestore.FieldValue.serverTimestamp() // Data oficial do servidor
        });

        alert("Lançamento salvo com sucesso!");

        // 5. Limpar campos do formulário após salvar
        descInput.value = "";
        valorInput.value = "";

    } catch (error) {
        console.error("Erro ao salvar transação:", error);
        alert("Erro ao salvar: " + error.message);
    } finally {
        if (typeof hideloading === "function") hideloading();
    }
}

// Função para carregar e listar as transações em tempo real
function loadTransactions() {
    const user = firebase.auth().currentUser;
    const listContainer = document.getElementById('transactions-list');

    if (!user) return;

    // O 'onSnapshot' atualiza a tela automaticamente toda vez que o banco muda
    firebase.firestore().collection('transacoes')
        .where('userId', '==', user.uid) // Filtra: Só mostra transações do usuário logado
        .orderBy('data', 'desc') // Mostra as mais recentes primeiro
        .onSnapshot((snapshot) => {
            listContainer.innerHTML = ""; // Limpa a lista atual

            if (snapshot.empty) {
                listContainer.innerHTML = `<p style="text-align:center; color:#ccc;">Nenhum lançamento encontrado.</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const trans = doc.data();
                const id = doc.id; 

                const colorClass = trans.tipo === 'receita' ? 'text-green' : 'text-red';
                const symbol = trans.tipo === 'receita' ? '+' : '-';

                const itemHTML = `
                    <div class="transaction-item">
                        <div style="display: flex; flex-direction: column;">
                            <strong style="color: white;">${trans.descricao}</strong>
                            <small style="color: #aaa;">${trans.categoria}</small>
                        </div>
                        <div style="text-align: right;">
                            <span class="${colorClass}" style="font-weight: bold; font-size: 18px;">
                                ${symbol} R$ ${trans.valor.toFixed(2)}
                            </span><br>
                            <button onclick="deleteTransaction('${id}')" style="width: auto; padding: 2px 8px; font-size: 11px; background: rgba(255,0,0,0.2); color: #ff4d4d; border: 1px solid #ff4d4d; margin-top: 5px; cursor:pointer; border-radius: 4px;">Excluir</button>
                        </div>
                    </div>
                `;
                listContainer.innerHTML += itemHTML;
            });
        }, (error) => {
            console.error("Erro ao carregar transações:", error);
            // Se der erro aqui, provavelmente é a falta do ÍNDICE no console do Firebase
            if(error.message.includes("index")) {
                alert("Erro de índice do banco de dados. Verifique o Console (F12) e clique no link azul para criar o índice.");
            }
        });
}

// Função para excluir uma transação
async function deleteTransaction(id) {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
        try {
            await firebase.firestore().collection('transacoes').doc(id).delete();
        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        }
    }
}
