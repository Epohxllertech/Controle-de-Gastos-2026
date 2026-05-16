/**
 * home.js
 * Lógica de transações financeiras com Firebase Firestore
 */

// EM VEZ DE DOMCONTENTLOADED, USAMOS O OBSERVAR DE ESTADO DE AUTENTICAÇÃO
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("Sessão confirmada! Carregando transações...");
        loadTransactions(); // Só chama a função quando o usuário for confirmado
    } else {
        console.log("Nenhum usuário detectado. O auth-guard deve redirecionar.");
    }
});

// Função para salvar a transação no Firestore
async function saveTransaction() {
    // ... (mantenha o resto da função saveTransaction exatamente como está)

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

function loadTransactions() {
    const user = firebase.auth().currentUser;
    const listContainer = document.getElementById('transactions-list');
    
    const elReceitas = document.getElementById('total-receitas');
    const elDespesas = document.getElementById('total-despesas');
    const elSaldo = document.getElementById('saldo-final');

    if (!user) {
        console.log("ERRO: Nenhum usuário logado encontrado.");
        return;
    }

    console.log("Buscando transações para o usuário: " + user.uid);

    firebase.firestore().collection('transacoes')
        .where('userId', '==', user.uid)
        .orderBy('data', 'desc')
        .onSnapshot((snapshot) => {
            console.log("O Firebase respondeu! Quantidade de documentos encontrados: " + snapshot.size);
            
            listContainer.innerHTML = "";
            let totalR = 0;
            let totalD = 0;

            if (snapshot.empty) {
                console.log("Atenção: A consulta retornou zero resultados.");
                listContainer.innerHTML = `<p style="text-align:center; color:#ccc;">Nenhum lançamento encontrado.</p>`;
                return;
            }
            
            // ... resto do código (o forEach e as somas) ...


            if (snapshot.empty) {
                listContainer.innerHTML = `<p style="text-align:center; color:#ccc;">Nenhum lançamento encontrado.</p>`;
                elReceitas.innerText = "R$ 0,00";
                elDespesas.innerText = "R$ 0,00";
                elSaldo.innerText = "R$ 0,00";
                return;
            }

            snapshot.forEach((doc) => {
                const trans = doc.data();
                const id = doc.id;

                // --- LÓGICA DE SOMA ---
                if (trans.tipo === 'receita') {
                    totalR += trans.valor;
                } else if (trans.tipo === 'despesa') {
                    totalD += trans.valor;
                }

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

            // --- ATUALIZAÇÃO DOS CARTÕES DO DASHBOARD ---
            const saldoFinal = totalR - totalD;
            
            elReceitas.innerText = `R$ ${totalR.toFixed(2)}`;
            elDespesas.innerText = `R$ ${totalD.toFixed(2)}`;
            elSaldo.innerText = `R$ ${saldoFinal.toFixed(2)}`;
            
            // Muda a cor do saldo para vermelho se estiver negativo
            elSaldo.style.color = saldoFinal >= 0 ? "#00d4ff" : "#ff4d4d";
        }, (error) => {
            console.error("Erro ao carregar transações:", error);
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
