

const ratings = document.querySelectorAll('.rating');
let editMode = true;


// //////// Light / Dark Mode //////// //
const modeToggle = document.querySelector('#modeToggle');
const body = document.querySelector('body');
const stylesheet = document.querySelector('link[href="style light.css"]');


modeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    stylesheet.href = 'style light.css';
  } else {
    body.classList.add('dark-mode');
    stylesheet.href = 'style dark.css';
  }
});

// MODAL DISCORD WEBHOOK
const discordModal = document.getElementById("discord-modal");
const discordBtn = document.getElementById("discord-btn");
const discordCloseBtn = document.getElementById("discord-modal-close-button");
const discordSaveBtn = document.getElementById("discord-modal-save-button");
const discordInput = document.getElementById("discord-modal-webhook-input");
const discordToggleBtn = document.getElementById("discord-toggle");
const discordToggleInput = document.getElementById("discord-toggle-input");

let currentDiscordToggle = "";
let currentDiscordWebhook = "";

discordBtn.addEventListener("click", () => {
  discordModal.style.display = "block";
  currentDiscordWebhook = discordInput.value;
  //update the discordToggleBtn class based on the value of discordToggleInput
  if (discordToggleInput.value === "true") {
    discordToggleBtn.classList.remove("disabled");
  } else {
    discordToggleBtn.classList.add("disabled");
  }
      
});

discordCloseBtn.addEventListener("click", () => {
  discordModal.style.display = "none";
  discordInput.value = currentDiscordWebhook;
});

discordSaveBtn.addEventListener("click", () => {
  discordModal.style.display = "none";
    
  //guardar el valor de la variable webhookURL en el local storage
  saveCharacterData();

});

discordToggleBtn.addEventListener("click", () => {
  if (discordToggleInput.value === "true") {
    discordToggleInput.value = "false";
    discordToggleBtn.classList.add("disabled");
    console.log(discordToggleInput.value);
      
  } else {
    discordToggleInput.value = "true";
    discordToggleBtn.classList.remove("disabled");
    console.log(discordToggleInput.value);
  }
  saveCharacterData();
});


// MODAL SELECCION DE CLAN
const modal = document.getElementById("clan-modal");
const inputField = document.getElementById("clan");
const acceptBtn = document.getElementById("accept-btn");
const closeBtn = document.getElementById("close-btn");
const clanList =document.querySelectorAll('#clan-modal li');
const logoDisplay = document.querySelector('#logo-display');
const headerLogoDisplay = document.querySelector('#header-logo-value');
let clanSelected = "";


inputField.addEventListener("click", () => {
  modal.style.display = "block";
});

clanList.forEach((clan) => {
  clan.addEventListener("click", () => {
    //Obtener el nombre del clan en ClanSelected
    clanSelected = clan.innerText;

    //Remover la clase Active de todos los otros li
    clanList.forEach((clan) => clan.classList.remove("active"));
    
    //Agregar la clase Active al li clickeado
    clan.classList.add("active");

    //Actualizar el logo en el modal
    logoDisplay.innerHTML = clan.dataset.clan;

    //actualizar el logo en el header
    headerLogoDisplay.value = clan.dataset.clan;
   });
});

acceptBtn.addEventListener("click", () => {
  modal.style.display = "none";
  inputField.value = clanSelected;
  updateHeaderLogo();
  saveCharacterData();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";

  //resetear el clan seleccionado
  headerLogoDisplay.value = "G"
  
  //remover clan seleccionado
  clanList.forEach((clan) => clan.classList.remove("active"));

  //reseter logo en el modal
  logoDisplay.innerHTML = "G";
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});


//Function to update the p #header-logo-display innerHTML with the value stored in 
//#header-logo-value input value
function updateHeaderLogo(){
  const headerLogoValue = document.querySelector('#header-logo-value').value;
  const headerLogoDisplay = document.querySelector('#header-logo-display');
  headerLogoDisplay.innerHTML = headerLogoValue;
}



/// FUNCIONALIDAD DE LOS PUNTITOS AL HACER CLICK ///
////////////////////////////////////////////////////
// Loop through each rating element
if(editMode===true){
ratings.forEach(rating => {
  // Get the hidden input and dot elements
  const input = rating.nextElementSibling;
  const dots = rating.querySelectorAll('.dot');

  // Add click event listener to each dot
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // Check if the user clicked on the first dot and if the current value is 1 or 0
      if (index === 0 && parseInt(input.value) === 1) {
        dots[0].classList.remove('filled');
        input.value = 0;
        
      } else if (index === 0 && parseInt(input.value) === 0) {
        dots[0].classList.add('filled');
        input.value = 1;
      } else {
        // Update the dot display
        dots.forEach((innerDot, innerIndex) => {
          if (innerIndex <= index) {
            innerDot.classList.add('filled');
          } else {
            innerDot.classList.remove('filled');
          }
        });

        // Update the hidden input value
        input.value = index + 1;
        
        saveCharacterData();
      }
    });
  });
});
}

// // // // // Comportamiento de TABS
const tabs = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    //remove active class from all tabs
    tabs.forEach((tab) => tab.classList.remove("active"));
    // Add active class to clicked tab
    tab.classList.add("active");

    //Hide All Contents
    contents.forEach((content) => content.classList.remove("active"));
    //Show content for clicked tab
    const tabContentId = tab.dataset.tab;
    document.getElementById(tabContentId).classList.add("active");
  });
});



// Define function to update dots (que es llamada al cargar el archivo)
function updateRatingDots(rating) {
  // Get the hidden input and dot elements
  const input = rating.nextElementSibling;
  const dots = rating.querySelectorAll('.dot');

  // Get the value from the hidden input
  const value = parseInt(input.value);

  // Loop through each dot and update the filled class
  dots.forEach((dot, index) => {
    if (index < value) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

// GUARDAR EN LOCAL STORAGE
// Save character data to local storage
function saveCharacterData() {
  // Get character data as JSON string
  const characterJSON = getCharacterData();
  // Save character data to local storage
  localStorage.setItem('characterData', characterJSON);
}

// Load character data from local storage
function loadCharacterData() {
  // Get character data from local storage
  const characterJSON = localStorage.getItem('characterData');
  // Parse character data from JSON string
  const characterData = JSON.parse(characterJSON);
  // Loop through all input or select elements
  const inputs = document.querySelectorAll('input' + ', select');
  inputs.forEach(input => {
    const id = input.id;
    const value = characterData[id];
    // Check if the input has an ID and a value
    if (id && value) {
      // Set the input value from the characterData object
      input.value = value;
    }
  });
}

// Call loadCharacterData when the page loads
window.onload = function() {
  loadCharacterData();
  // Loop through each rating element and update the dots
  const ratings = document.querySelectorAll('.rating');
  ratings.forEach(rating => {
  updateRatingDots(rating);
  });
  //update health squares
  updateHealthSquares()
  //update blood per turn
  updateBloodPerTurn()
  //block the blood pool based on generation
  blockBloodPool();
  //update damagePenalty
  updateDamagePenalty();
  //reset dice roller
  resetAllDice();
  //update image clan logo
  updateHeaderLogo();
}

// Call saveCharacterData when an input is changed
const inputs = document.querySelectorAll('input' + ', select');
inputs.forEach(input => {
  input.addEventListener('change', saveCharacterData);
});




//GUARDAR INFORMACION DEL PERSONAJE EN JSON
function getCharacterData() {
  let characterData = {};

  // Loop through all input or select elements
  const inputs = document.querySelectorAll('input' + ', select');
  inputs.forEach(input => {
    const id = input.id;
    const value = input.value;


    // Check if the input has an ID and a value and is not a file input
    if (id && value && input.type !== 'file') {
      // Add the input ID and value to the characterData object
      characterData[id] = value;
    }
  });

  return JSON.stringify(characterData);
}

function downloadCharacterData() {
	//get the character data as a JSON string
	let characterJSON = getCharacterData();
	
	//create a Blob objetc from the JSON data
	let characterBlob = new Blob([characterJSON], {type: 'application/json'});
	
	//create a URL for the Blob objet
	let characterURL = URL.createObjectURL(characterBlob);
	
	//create a download link
	let downloadLink = document.createElement('a');
	downloadLink.href = characterURL;
	downloadLink.download = 'character.json';
	downloadLink.textContent = 'Download character data';
	
	//append the download link to the document body
	document.body.appendChild(downloadLink);
	
	//click the downliad link to trigger the download
	downloadLink.click();
	
	//remove the download link from the document body
	document.body.removeChild(downloadLink);
}


///////////////////////////
// Cargar el archivo ///
//////////////////////////
const fileInput = document.getElementById('file-input');
const iconForUpload = document.getElementById('file-input-icon');

function clickOnFileInput() {
 
  fileInput.click();
}

fileInput.addEventListener('change', (e) => {
	const file = e.target.files[0];
	if (!file) {
		return;
	}
	

	const reader = new FileReader();

	reader.onload = (event) => {
		const json = event.target.result;
		const characterData = JSON.parse(json);

		// loop through keys in characterData object
		for (const key in characterData) {
			if (characterData.hasOwnProperty(key)) {
				// find the corresponding input element with the same name
				const inputElement = document.querySelector(`[id="${key}"]`);
				if (inputElement) {
					// set the value of the input element
					inputElement.value = characterData[key];
				}
			}
		}

		// Loop through each rating element and update the dots
		const ratings = document.querySelectorAll('.rating');
		ratings.forEach(rating => {
		updateRatingDots(rating);
		});
    //update health squares
    updateHealthSquares()
    //update blood per turn
    updateBloodPerTurn()
    //block the blood pool based on generation
    blockBloodPool();
    //update damagePenalty
    updateDamagePenalty();
    //update image clan logo
    updateHeaderLogo();
	};

	reader.readAsText(file);
});
	
/////////////////////////////
////// SISTEMA DE SALUD ////
////////////////////////////

// funcion para obtener un listado de todos los values de los hidden inputs
// asociados a los span class="square" y ordenarlos de mayor a menor
const healthSquares = document.querySelectorAll('.square');



function getHealthValues() {
  let healthValues = [];
  healthSquares.forEach((square) => {
    healthValues.push(square.nextElementSibling.value);
  });
  healthValues.sort((a, b) => b - a);
  return healthValues;
}

// funcion para actualizar el value del hidden input asociado al span class="square"
// una vez que se ordenaron con la funcion getHealthValues()
function updateHealthValues() {
  let healthValues = getHealthValues();
  healthSquares.forEach((square, index) => {
    square.nextElementSibling.value = healthValues[index];
  });
}



// funcion para actualizar cada span class="square" agregandole la clase segun el value que tenga el hidden input 
// segun los siguientes valores:
// 0 = sin clase agregada
// 1 = "contundente"
// 2 = "letal"
// 3 = "agravado"

function updateHealthSquares() {
  healthSquares.forEach((square) => {
    square.classList.remove("contundente");
    square.classList.remove("letal");
    square.classList.remove("agravado");

    let squareValue = square.nextElementSibling.value;
    if (squareValue == 1) {
      square.classList.add("contundente");
    } else if (squareValue == 2) {
      square.classList.add("letal");
    } else if (squareValue == 3) {
      square.classList.add("agravado");
    }
    saveCharacterData();
  });
}



const addButtons = document.querySelectorAll(".button-add");
const removeButtons = document.querySelectorAll(".button-remove");


//AGREGAR DANIO
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let healthValues = getHealthValues();
    
    //Buscar un "0" en el array "healthValues
    let searchValue = "0";
    let i;
    for(i = 0; i < healthValues.length; i++) {
      if (healthValues[i] === searchValue) {
        break;
      }
    }
    
    if (i < healthValues.length) {
      if (button.id == "contundenteAdd") {
        healthValues[i] = 1;
      }
      if (button.id == "letalAdd") {
        healthValues[i] = 2;
      }
      if (button.id == "agravadoAdd") {
        healthValues[i] = 3;
      }
      
    } else {
    }
    //Ordena los valores
    healthValues.sort((a, b) => b - a);
    
    //Pone los valores del array healthValues en los hidden inputs values.
    healthSquares.forEach((square, index) => {
      square.nextElementSibling.value = healthValues[index];
    });
    
    //Actualiza los span class="square" con las clases correspondientes
    updateHealthSquares();
    
    //Actualiza el Penalizador de Daño
    updateDamagePenalty();
  });
});

//RESTAR DANIO
removeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let healthValues = getHealthValues();

    //para buscar en el array el daño a remover
    let searchValue = "0";
    let i;
    if (button.id == "contundenteRemove") {
      searchValue="1";
    }
    if (button.id == "letalRemove") {
      searchValue="2";
    }
    if (button.id == "agravadoRemove") {
      searchValue="3";
    }

    //Buscar en el array el tipo de daño a remover
    for(i = 0; i < healthValues.length; i++) {
      if (healthValues[i] === searchValue) {
        break;
      }
    }
    if (i < healthValues.length) {
      healthValues[i] = "0";
    } else {
    }
    //Ordena los valores
    healthValues.sort((a, b) => b - a);

    //Pone los valores del array healthValues en los hidden inputs values.
    healthSquares.forEach((square, index) => {
      square.nextElementSibling.value = healthValues[index];
    });
    //Actualiza los span class="square" removiendo las clases correspondientes
    updateHealthSquares();

    //Actualiza el Penalizador de Daño
    updateDamagePenalty();
  });
});

// // // // Penalizador por Daño // // // //
let damagePenalty = 0;

//Funcion para actualizar damagePenalty cada vez que se agrega o remueve daño
function updateDamagePenalty() {
  let healthValues = getHealthValues();

  //Based on the ammount of 0s in the array, calculate the damage penalty
  //>=0 = -10
  //1 = -5
  //2 = -2
  //3 = -2
  //4 = -1
  //5 = -1
  //>=6 = 0
  
  //contar los 0s en el array healthValues
  let count = 0;
  for (let i = 0; i < healthValues.length; i++) {
    if (healthValues[i] == 0) {
      count++;
    }
  }
  //update value in damagePenalty based on the count
  if (count >= 6) {
    damagePenalty = 0;
  } else if (count == 5 || count == 4) {
    damagePenalty = -1;
  } else if (count == 3 || count == 2) {
    damagePenalty = -2;
  } else if (count == 1) {
    damagePenalty = -5;
  } else if (count == 0) {
    damagePenalty = -5;
  }
  //update the value in the input
  document.querySelector("#penalizadorSaludLabel").innerHTML = damagePenalty;
  updateFinalPoolSize();
}




// PUNTOS DE SANGRE POR TURNO SEGUN GENERACION


//funcion para calcular el texto del label #bloodPerTurn 
//segun el valor del input #generacion
function calculateBloodPerTurn(){
  const bloodPerTurn = document.querySelector("#bloodPerTurn");
  const generationValue = document.querySelector("#generacion").value;
  //generacion = o mayor que 10 = 1 punto de sangre por turno
  //generacion = 9 = 2 puntos de sangre por turno
  //generacion = 8 = 3 puntos de sangre por turno
  //generacion = 7 = 4 puntos de sangre por turno
  //generacion = 6 = 6 puntos de sangre por turno
  //generacion = 5 = 8 puntos de sangre por turno
  //generacion = 4 = 10 puntos de sangre por turno 
  //generacion =< 3 = "???" puntos de sangre por turno 
  if (generationValue >= 10) {
    bloodPerTurn.innerHTML = "1";
  }
  if (generationValue == 9) {
    bloodPerTurn.innerHTML = "2";
  }
  if (generationValue == 8) {
    bloodPerTurn.innerHTML = "3";
  }
  if (generationValue == 7) {
    bloodPerTurn.innerHTML = "4";
  }
  if (generationValue == 6) {
    bloodPerTurn.innerHTML = "6";
  }
  if (generationValue == 5) {
    bloodPerTurn.innerHTML = "8";
  }
  if (generationValue == 4) {
    bloodPerTurn.innerHTML = "10";
  }
  if (generationValue <= 3) {
    bloodPerTurn.innerHTML = "???";
  }
}

//funcion para actualizar el texto del label #bloodPerTurn usando la func calculateBloodPerTurn()
function updateBloodPerTurn() {
  
  calculateBloodPerTurn();
}

// llamar a la funcion updateBloodPerTurn() cuando se cambia el campo #generacion
document.querySelector("#generacion").addEventListener("change", function(){
  updateBloodPerTurn();
  blockBloodPool();
});

// Funcion: Bloquear blood pool
function blockBloodPool (){
  const generationValue = parseInt(document.querySelector("#generacion").value);
  const bloodRating = document.querySelector("#blood-rating");
  const dots = bloodRating.querySelectorAll(".dot");

  //maximum blood pool based on generation
  let maxBloodPool = 30;
  if (generationValue <= 6){
    maxBloodPool = 29;
  }else if (generationValue <= 7){
    maxBloodPool = 19;
  }else if (generationValue <= 8){
    maxBloodPool = 14;
  }else if (generationValue <= 9){
    maxBloodPool = 13;
  }else if (generationValue <= 10){
    maxBloodPool = 12;
  }else if (generationValue <= 11){
    maxBloodPool = 11;
  }else if (generationValue <= 12){
    maxBloodPool = 10;
  }else if (generationValue >= 13){
    maxBloodPool = 9;
  }

  //disable dots based on maxBloodPool
  for(let i = 0; i < dots.length; i++){
    const dot = dots[i];
    const dotValue = parseInt(dot.getAttribute("data-value"));
    if(dotValue > maxBloodPool){
      dot.classList.add("disabled");
    }else{
      dot.classList.remove("disabled");
    }
  }
  
  //set the initial blood value to the maximum blood pool
  const bloodValue = document.querySelector("#blood-value");
  bloodValue.value = maxBloodPool;
}


////////-------------------------------------------////////
////////-------------------------------------------////////
////////                  DADOS                    ////////
////////-------------------------------------------////////
////////-------------------------------------------////////

//REFACTOR: CONSTANTS

//Registra el total de dados en el pool
let finalPoolSize = 0;

//Boton de tirar dados
const diceButton = document.querySelector("#diceButton");

//Listado de atributos
const attributesList = document.querySelectorAll('.attributes .form-group.attribute label');

//Listado de habilidades
const abilitiesList = document.querySelectorAll('.abilities .form-group.attribute label');

//Todos los checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');


//REFACTOR: Update finalPoolSize
function updateFinalPoolSize(){
  const FirstDicePool = parseInt(document.querySelector("#dicePool1").value);
  const SecondDicePool = parseInt(document.querySelector("#dicePool2").value);
  const diceMod = parseInt(document.querySelector("#diceMod").value);
  const penalizadorSalud = document.querySelector("#penalizadorSalud").checked;
  const penalizadorSaludValue = parseInt(document.querySelector("#penalizadorSaludLabel").innerHTML);
  //calculate finalPoolSize

  //check if penalizadorSalud is used
  if (penalizadorSalud == true){
    finalPoolSize = FirstDicePool + SecondDicePool + diceMod + penalizadorSaludValue;
  }else{
    finalPoolSize = FirstDicePool + SecondDicePool + diceMod;
  }

  //show finalPoolSize in #diceButton
  if (finalPoolSize <= 0){
    diceButton.innerHTML = "Sin dados";
    
    //agregar clase disabled al boton
    diceButton.classList.add("disabled");
    
    //disable the button
    diceButton.disabled = true;
  }else{
    diceButton.innerHTML = `Lanzar<br>${finalPoolSize}d10`;
    
    //remove clase disabled al boton
    diceButton.classList.remove("disabled");

    //enable the button
    diceButton.disabled = false;
  }
}


//REFACTOR: Tirar los Dados
function rollTheDice(){
  //stablish difficulty
  const difficulty = document.querySelector("#difficulty").value;
  //check if willpower is used
  const willpower = document.querySelector("#willpower").checked;  
  //check if specialty is used
  const specialty = document.querySelector("#specialty").checked;
  //Obtain elements for the results
  const rollsList = document.querySelector("#diceRolls");
  const resultElement = document.querySelector("#diceResult");
  //obtener el atributo y habilidad seleccionado (si hay)
  const pool1 = document.querySelector("#dicePool1Label").innerHTML|| "";
  const pool1Size = document.querySelector("#dicePool1").value;
  const pool2 = document.querySelector("#dicePool2Label").innerHTML|| "";
  const pool2Size = document.querySelector("#dicePool2").value;
  const mods = document.querySelector("#diceMod").value;
  const damagePenaltyCheckbox = document.querySelector("#penalizadorSalud").checked;
  const damagePenalty = parseInt(document.querySelector("#penalizadorSaludLabel").innerHTML);

  //obtain character name
  const characterName = document.querySelector("#nombre").value;
  //obtain character clan
  const characterClan = document.querySelector("#clan").value||"";
  
  
  
  //Resetear mensaje de Voluntad usada  
  let willpowerNotice = "";
  let willpowerTrueFalse = "No";
  let specialtyTrueFalse = "No";
  let damagePenaltyTrueFalse = "No";
  
  if (specialty === true){
    specialtyTrueFalse = "Si";
  }
  if (damagePenaltyCheckbox == true){
    damagePenaltyTrueFalse = "Si";
  }

  
  // roll the dice and count successes and botches
  let successes = 0;
  let fails = 0;
  let botches = 0;
  let color = "";
  const rolls = [];
  for (let i = 0; i < finalPoolSize; i++) {
    const roll = Math.floor(Math.random() * 10) + 1;
    rolls.push(roll);
    if (specialty === true && roll === 10) {
      successes += 2;
    }else if (roll >= difficulty) {
      successes++;
    } else if (roll === 1) {
      botches++;
    }else{
      fails++;
    }
  }
  
  //willpower automatic success
  if (willpower === true) {
    successes++;
    willpowerNotice = " (1 exito por Voluntad)";
    willpowerTrueFalse = "Si";
  }
  
  // calculate the final result
  let resultText;
  if (successes === 0 && botches === 0) {
    color = "11247616";
    resultText = "Fallo";
  } else if (successes === 0 && botches > 0) {
    resultText = "Fracaso";
    color = "14225681";
  }else if (successes <= botches) {
    color = "11247616";
    resultText = "Fallo";
  }else if ((successes - botches) > 1) {
    color = "58911";
    successes -= botches;
    resultText = `${successes} Exitos`;
  } else {
    color = "58911";
    successes -= botches;
    resultText = `${successes} Exito`;
  }


  //add willpower notice to resultText
  resultText += willpowerNotice;

  //Show the results
  //clear any previous results
  rollsList.innerHTML = "";
  resultElement.innerHTML = "";
  
  // display individual rolls
  rolls.sort((a, b) => b - a); // sort in descending order
  for (const roll of rolls) {
    const rollElement = document.createElement("span");
    rollElement.innerHTML = roll;
    if (roll === 1) {
      rollElement.classList.add("botch");
    } else if (roll >= difficulty) {
      rollElement.classList.add("success");
    } else {
      rollElement.classList.add("fail");
    }
    rollsList.appendChild(rollElement);
  }
  
  // display final Text result
  const resultTextElement = document.createElement("p");
  resultTextElement.innerHTML = resultText;
  resultElement.appendChild(resultTextElement);
  const botchElement = document.querySelectorAll('.botch');
  //need to iterate on each botchElement and set its innerHTML to "M"
  for (let i = 0; i < botchElement.length; i++) {
    botchElement[i].innerHTML = "G";
  }

  // Post to Discord the result
  messageToDiscord = `**${resultText}**\n${rolls.join(", ")}`;
  sendToDiscordRoll(characterName, characterClan, pool1, pool1Size, pool2, pool2Size, mods, resultText, rolls, difficulty, color, damagePenalty, damagePenaltyTrueFalse, willpowerTrueFalse, specialtyTrueFalse);

}


// DISCORD WEBHOOK //
// Send data to Discord webhook
function sendToDiscordRoll(characterName, clan, pool1, pool1Size, pool2, pool2Size, mods, result, rolls, difficulty, color, damagePenalty, damagePenaltyTrueFalse, willpowerTrueFalse, specialtyTrueFalse) {
  const webhookURL = discordInput.value;

  //check if webhookURL is empty
  if (webhookURL === "" || discordToggleInput.value === "false") {
    return;
  }
  const payload = {
    "content": "",
    "embeds": [
      {
        "author": {
          "name": characterName + " de " + clan,
          "url": "https://kel-hendros.github.io/v20-character-sheets/"
        },
        "title": result,
        "url": "https://kel-hendros.github.io/v20-character-sheets/",
        "description": "**" + pool1 + "** (" + pool1Size + ")  +  **" + pool2 + "** (" + pool2Size + ")  +   Mod: (" + mods + ") = " + finalPoolSize,
        "color": color,
        "fields": [
          {
            "name": "Tirada",
            "value": "**" + rolls + "**",
            "inline": true
          },
          {
            "name": "Dificultad",
            "value": difficulty,
            "inline": true
          },
          {
            "name": "Penalizador por Daño",
            "value": damagePenaltyTrueFalse + " aplicado. " + damagePenalty,
          },
          {
            "name": "Voluntad", 
            "value": willpowerTrueFalse,
            "inline": true
          },
          {
            "name": "Especialidad",
            "value": specialtyTrueFalse,
            "inline": true
          }
        ],
        "footer": {
          "text": "Powered by Kelhendros"
        }
      }
    ]
  };
  
  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}





//REFACTOR: Presionar boton #diceButton
diceButton.addEventListener("click", () => {
  rollTheDice();
});



//REFACTOR: Add dice and name values to DicePool1 on click on attributes.
attributesList.forEach((attribute) => {
  attribute.addEventListener('click', (event) => {
    const input = event.currentTarget.nextElementSibling.nextElementSibling;
    
    //Update value and label for Pool1
    document.querySelector("#dicePool1").value = input.getAttribute('value');
    document.querySelector("#dicePool1Label").innerHTML = capitalizeFirstLetter(input.getAttribute('name'));

    //Remove class from the previously selected attribute
    const previouslySelectedAttributes = document.querySelectorAll('.atributo-seleccionado');
    previouslySelectedAttributes.forEach((attribute) => {
      attribute.classList.remove('atributo-seleccionado');
    });

    //add class to the selected attribute
    const selectedAttribute = event.currentTarget;
    selectedAttribute.classList.add('atributo-seleccionado');
    
    updateFinalPoolSize();
    
  });
});

//REFACTOR: Add dice and name values to DicePool2 on click on abilities.
abilitiesList.forEach((ability) => {
  ability.addEventListener('click', (event) => {
    const input = event.currentTarget.nextElementSibling.nextElementSibling;
    
    //Update value and label for Pool2
    document.querySelector("#dicePool2").value = input.getAttribute('value');
    document.querySelector("#dicePool2Label").innerHTML = capitalizeFirstLetter(input.getAttribute('name'));
    
    //remove class from the previously selected ability
    const previouslySelectedAbility = document.querySelectorAll('.habilidad-seleccionada');
    previouslySelectedAbility.forEach((ability) => {
      ability.classList.remove('habilidad-seleccionada');
    });
        
    //add class to the selected ability
    const selectedAbility = event.currentTarget;
    selectedAbility.classList.add('habilidad-seleccionada');

    updateFinalPoolSize();
  
  });
});

//REFACTOR: Update the finalPoolSize whenever dicePool1, dicePool2 or diceMod inputs change manually
//DicePool1 manually change
document.querySelector("#dicePool1").addEventListener("change", function() {
  updateFinalPoolSize();
});

//DicePool2 manually change
document.querySelector("#dicePool2").addEventListener("change", function() {
  updateFinalPoolSize();
});

//DiceMod manually change
document.querySelector("#diceMod").addEventListener("change", function() {
  updateFinalPoolSize();
});


//REFACTOR: Update the finalPoolSize whenever a checkbox is checked or unchecked
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function() {
    updateFinalPoolSize();
});
});


//REFACTOR: Borrar los inputs de los pools de dados al hacer click

document.querySelector("#dicePool1").addEventListener("click", function() {
  resetDicePool1();
  this.select()
});
document.querySelector("#dicePool2").addEventListener("click", function() {
  resetDicePool2();
  this.select()
});
document.querySelector("#diceMod").addEventListener("click", function() {
  resetDiceMod();
  this.select()
});
document.querySelector("#difficulty").addEventListener("click", function() {
  document.querySelector("#difficulty").value = 6;
  this.select()
});


//REFACTOR: Reset the dicePool1 when clicked and the finalPoolSize
function resetDicePool1() {
  document.querySelector("#dicePool1").value = "0";
  document.querySelector("#dicePool1Label").innerHTML = ("");
  updateFinalPoolSize();

  //remove class from the previously selected attribute
  const previouslySelectedAttribute = document.querySelectorAll('.atributo-seleccionado');
  previouslySelectedAttribute.forEach((attribute) => {
    attribute.classList.remove('atributo-seleccionado');
  });
}

//REFACTOR: Reset the dicePool2 when clicked and the finalPoolSize
function resetDicePool2() {
  document.querySelector("#dicePool2").value = "0";
  document.querySelector("#dicePool2Label").innerHTML = ("");
  updateFinalPoolSize();

  //remove class from the previously selected ability
  const previouslySelectedAbility = document.querySelectorAll('.habilidad-seleccionada');
  previouslySelectedAbility.forEach((ability) => {
    ability.classList.remove('habilidad-seleccionada');
  });
}

//REFACTOR: Reset the diceMod when clicked and the finalPoolSize
function resetDiceMod() {
  document.querySelector("#diceMod").value = "0";
  updateFinalPoolSize();
}

//REFACTOR: Reset all inputs when clicked on the trash icon
function resetAllDice() {
  resetDicePool1();
  resetDicePool2();
  resetDiceMod();
  updateFinalPoolSize();
  document.querySelector("#difficulty").value = 6;
} 

document.querySelector(".gg-trash").addEventListener("click", function() {
  resetAllDice();
});

//REFACTOR: Poner en mayuscula la primera letra de un string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
