const taskInput  = document.getElementById("input");
const inputButton = document.getElementById("input-button");
const chosenColor = document.getElementById("select-color");

const taskList = document.getElementById("task-list");

inputButton.addEventListener("click", addTask);
taskList.addEventListener("click", removeTask);

function addTask(e){
    
    if(taskInput.value === "")
        // caso speciale: input vuoto
        alert("Inserisci un messaggio per il tuo task");
    else{
        // Creazione del task
        const li = document.createElement("li");
        li.className = "task";
        const colore = chosenColor.value;
        li.style.backgroundColor = colore;
        li.appendChild(document.createTextNode(taskInput.value));
        // Creazione x per eliminare il task
        const link = document.createElement("a");
        link.className = "delete-todo";
        link.innerHTML = "<h3>X</h3>";
        li.appendChild(link);
        taskList.appendChild(li);
        taskInput.value = "";
    }
    e.preventDefault();
}

function removeTask(e){
    if (e.target.parentElement.classList.contains("delete-todo"))
        e.target.parentElement.parentElement.remove();
    e.preventDefault();
}