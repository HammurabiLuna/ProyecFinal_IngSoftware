let selectedDate = {};

const calendar = new VanillaCalendar({
  selector: "#myCalendar",
  onSelect: (data, elem) => {
    selectedDate = new Date(data.date).toLocaleDateString().split("T")[0];
    displayTache(selectedDate);
  },
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",  
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Deciembre",
  ],
  shortWeekday: ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"],
});

const viewCalendar = document.querySelector("#myCalendar");
const agendaForm = document.querySelector(".cardAgenda");
const viewTache = document.querySelector(".agenda");
const tacheList = document.querySelector("#tacheList");
const tacheTitle = document.querySelector("#tacheTitle");
const ajoutTache = document.querySelector(".ajout");

viewCalendar.addEventListener("click", () => {
  viewTache.style.display = "block";
});

agendaForm.addEventListener("submit", addTache);

tacheList.addEventListener("click", suppTache);

function openForm() {
  return (agendaForm.style.display = "block");
}


function addTache(e) {
  e.preventDefault();
  const formData = new FormData(agendaForm);
  const tache = formData.get("tache");
  const description = formData.get("description");
  const heure = formData.get("heure");
  const duree = formData.get("duree");
  const date = selectedDate;
  const newTache = {
    id: Date.now(),
    tache,
    description,
    heure,
    duree,
    date,
  };
  console.log(newTache);

  if (date !== "" && tache !== "") {
    saveAgenda(newTache);
    agendaForm.reset();
    displayTache(selectedDate);
  } else {
    if (date !== "" && tache == "") {
      alert("Por favor complete campos faltantes");
    } else if (date !== selectedDate && tache !== "") {
      alert("Veuillez choisir une date");
    }
  }
}


function saveAgenda(tache) {
  let taches = JSON.parse(localStorage.getItem("taches")) || [];
  taches = [...taches, tache];
  localStorage.setItem("taches", JSON.stringify(taches));
}

/**
 *
 * Affichage d'une seule tache selon la date
 */
function displayTache(date) {
  let taches = JSON.parse(localStorage.getItem("taches")) || [];
  let tacheAtThisDate = taches.filter((t) => t.date === date);

  if (tacheAtThisDate.length === 1) {
    const tache = tacheAtThisDate[0];
    tacheTitle.innerHTML = "Tarea";
    tacheList.innerHTML = ` <button class='buttonFormAgenda' onclick="openForm()">Agregar una tarea</button><div>
    
    <h4 class="labelAgenda hAgenda">${tache.tache}</h4>
    <ul class='ulAgenda'>
    <li><span class='strongAgenda'>Hora:</span> ${
      tache.heure ? tache.heure : "Sin hora establecida"
    }</li>
    <li><span class='strongAgenda'>Descripcion:</span> ${
      tache.description !== "" ? tache.description : "Sin descripción"
    }</li>
    <li><span class='strongAgenda'>Duración:</span>${tache.duree} ${
      tache.duree !== "" ? "de duracion" : "Sin duracion prevista"
    }</li>
    </ul>
    <button class='buttonFormAgenda' data-id='${tache.id}'>Borrar</button>
    </div>`;
  } else if (tacheAtThisDate.length > 1) {
    tacheTitle.innerHTML = "Taches";
    tacheList.innerHTML =
      '<button class="buttonFormAgenda" onclick="openForm()">Agregar una tarea</button>';
    displayTaches(tacheAtThisDate);
  } else {
    tacheTitle.innerHTML = "Sin tareas";
    tacheList.innerHTML = `<div>
    
    <h4 class='hAgenda labelAgenda'>No hay tareas asignadas estes dia</h4>
    <button class="buttonFormAgenda" onclick="openForm()">Agregar una tarea</button>
    </div>
    `;
  }
}

/**
 *
 * Affichage de la liste des taches
 */
function displayTaches(taches) {
  let content = [];

  taches.forEach((tache) => {
    const singleTacheHTML = `<div>
    <h4 class="labelAgenda hAgenda">${tache.tache}</h4>
    <ul class='ulAgenda'>
    <li><span class='strongAgenda'>Hora:</span> ${
      tache.heure ? tache.heure : "Sin hora establecida"
    }</li>
    <li><span class='strongAgenda'>Descripcion:</span> ${
      tache.description !== "" ? tache.description : "Sin descripción"
    }</li>
    <li> <span class='strongAgenda'>Duración:</span> ${tache.duree} ${
      tache.duree !== "" ? "de duracion" : "Sin duracion prevista"
    }</li>
    </ul>
    <button class="buttonFormAgenda" data-id='${tache.id}'>Borrar</button>
    </div>
    `;
    content = [...content, singleTacheHTML];
  });
  tacheList.innerHTML += content.join("");
}

/**
 *
 *Suppression d'une tache
 */
function suppTache(e) {
  if (e.target.nodeName.toLowerCase() !== "button") {
    return;
  } else {
    const tacheId = Number(e.target.dataset.id);
    let taches = JSON.parse(localStorage.getItem("taches")) || [];
    taches = taches.filter((tache) => tache.id !== tacheId);
    localStorage.setItem("taches", JSON.stringify(taches));
    displayTache(selectedDate);
  }
}