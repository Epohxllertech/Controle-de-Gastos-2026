function showloading(){
    const div = document.createElement("div");
    div.classList.add("loading", "centralize");

    const label = document.createElement("label");
    label.innerText = "Carregando...";

    div.appendChild(label);

    document.body.appendChild(div);

    //setTimeout(hideloading, 1500);

    //alert("Carregando...");
}

function hideloading(){
    const loadings = document.getElementsByClassName("loading");
    if (loadings.length){
        loadings[0].remove();
    }
    

    //alert("Pronto!");
}