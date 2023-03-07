const ratings = document.querySelectorAll('.rating');
let editMode = true;


// MODAL SELECCION DE CLAN
const modal = document.getElementById("clan-modal");
const inputField = document.getElementById("clan");
const acceptBtn = document.getElementById("accept-btn");
const closeBtn = document.getElementById("close-btn");
const clanList =document.querySelectorAll('#clan-modal li');
const logoDisplay = document.querySelector('#logo-display');
let clanSelected = "";

inputField.addEventListener("click", () => {
  modal.style.display = "block";
  console.log("click en input clan");
});

clanList.forEach((clan) => {
  clan.addEventListener("click", () => {
    clanSelected = clan.innerText;
    clanList.forEach((clan) => clan.classList.remove("active"));
    clan.classList.add("active");
    logoDisplay.innerHTML = clan.dataset.clan;
    console.log(clanSelected, clan.dataset.clan);
  });
});

acceptBtn.addEventListener("click", () => {
  modal.style.display = "none";
  inputField.value = clanSelected;
  saveCharacterData()
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});





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
        console.log(input.value);
      } else if (index === 0 && parseInt(input.value) === 0) {
        dots[0].classList.add('filled');
        input.value = 1;
        console.log(input.value);
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
        console.log(input.value);
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
    console.log("Al clickear, este es el valor de healthValues" + healthValues);
    
    //Buscar un "0" en el array "healthValues
    let searchValue = "0";
    let i;
    for(i = 0; i < healthValues.length; i++) {
      if (healthValues[i] === searchValue) {
        console.log("hay un 0 en la posicion " + i);
        break;
      }
    }
    
    if (i < healthValues.length) {
      if (button.id == "contundenteAdd") {
        healthValues[i] = 1;
        console.log("contundente clickeado");
        console.log(healthValues);
      }
      if (button.id == "letalAdd") {
        healthValues[i] = 2;
        console.log("letal clickeado");
        console.log(healthValues);
      }
      if (button.id == "agravadoAdd") {
        healthValues[i] = 3;
        console.log(healthValues);
      }
      
    } else {
      console.log("no hay un 0 en el array");
    }
    //Ordena los valores
    healthValues.sort((a, b) => b - a);
    
    //Pone los valores del array healthValues en los hidden inputs values.
    healthSquares.forEach((square, index) => {
      square.nextElementSibling.value = healthValues[index];
    });
    //Actualiza los span class="square" con las clases correspondientes
    updateHealthSquares();
    console.log("final" + healthValues);
  });
});

//RESTAR DANIO
removeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let healthValues = getHealthValues();
    console.log("Al clickear, este es el valor de healthValues" + healthValues);

    //para buscar en el array el daño a remover
    let searchValue = "0";
    let i;
    if (button.id == "contundenteRemove") {
      console.log("contundente remove clickeado");
      searchValue="1";
    }
    if (button.id == "letalRemove") {
      console.log("letal remove clickeado");
      searchValue="2";
    }
    if (button.id == "agravadoRemove") {
      console.log("agravado remove clickeado");
      searchValue="3";
    }

    //Buscar en el array el tipo de daño a remover
    for(i = 0; i < healthValues.length; i++) {
      if (healthValues[i] === searchValue) {
        console.log("hay un " + searchValue + " en la posicion " + i);
        break;
      }
    }
    if (i < healthValues.length) {
      healthValues[i] = "0";
      console.log("danio removido" + healthValues);
    } else {
      console.log("no hay un " + searchValue + " en el array");
    }
    //Ordena los valores
    healthValues.sort((a, b) => b - a);

    //Pone los valores del array healthValues en los hidden inputs values.
    healthSquares.forEach((square, index) => {
      square.nextElementSibling.value = healthValues[index];
    });
    //Actualiza los span class="square" removiendo las clases correspondientes
    updateHealthSquares();
    console.log("final" + healthValues);
  });
});

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
  console.log("updateBloodPerTurn");
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




// ROLL THE DICE!!! DADOS!
function rollDice(pool1, pool2, modifier, difficulty) {
  // combine the two dice pools into one array
  const dicePool = [...Array(pool1).fill(0), ...Array(pool2).fill(0)];
  
  // add or subtract dice based on the modifier
  if (modifier > 0) {
    dicePool.push(...Array(modifier).fill(0));
  } else if (modifier < 0) {
    dicePool.splice(0, -modifier);
  }
  
  // calculate actual size of the pool, excluding any added or removed dice from modifier
  const finalPoolSize = pool1 + pool2 + Math.max(modifier, 0);

  // roll the dice and count successes and botches
  let successes = 0;
  let fails = 0;
  let botches = 0;
  const rolls = [];
  for (let i = 0; i < finalPoolSize; i++) {
    const roll = Math.floor(Math.random() * 10) + 1;
    rolls.push(roll);
    if (roll >= difficulty) {
      successes++;
    } else if (roll === 1) {
      botches++;
    }else{
      fails++;
    }
  }
  
  // calculate the final result
  let resultText;
  if (successes === 0 && botches === 0) {
    resultText = "Fallo";
  } else if (successes === 0 && botches > 0) {
    resultText = "Fracaso";
  }else if (successes <= botches) {
      resultText = "Fallo";
  }else if ((successes - botches) > 1) {
    successes -= botches;
    resultText = `${successes} Exitos`;
  } else {
    successes -= botches;
    resultText = `${successes} Exito`;
  }
  return [rolls, resultText];
}

document.querySelector("#diceButton").addEventListener("click", function() {
  const pool1 = parseInt(document.querySelector("#dicePool1").value);
  const pool2 = parseInt(document.querySelector("#dicePool2").value);
  const modifier = parseInt(document.querySelector("#diceMod").value);
  const difficulty = parseInt(document.querySelector("#difficulty").value);
  const [rolls, resultText] = rollDice(pool1, pool2, modifier, difficulty);
  const rollsList = document.querySelector("#diceRolls");
  const resultElement = document.querySelector("#diceResult");
  
  // clear any previous results
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
  
  // display final result
  const resultTextElement = document.createElement("p");
  resultTextElement.innerHTML = resultText;
  resultElement.appendChild(resultTextElement);
  const botchElement = document.querySelectorAll('.botch');
  //need to iterate on each botchElement and set its innerHTML to "M"
  for (let i = 0; i < botchElement.length; i++) {
    botchElement[i].innerHTML = "G";
  }
  
});

const dicePoolAttribute = {
  name: "",
  die: 0,
}
const dicePoolAbility = {
  name: "",
  die: 0,
}


//DICE POOL 1
const attributesPool = document.querySelectorAll('.attributes .form-group.attribute label');
let dicePool1 = {};

attributesPool.forEach((attributePool) => {
  attributePool.addEventListener('click', (event) => {
    const input = event.currentTarget.nextElementSibling.nextElementSibling;
    dicePoolAttribute.name = capitalizeFirstLetter(input.getAttribute('name'));
    dicePoolAttribute.die = input.getAttribute('value');

    //remove class from the previously selected attribute
    const previouslySelectedAttribute = document.querySelectorAll('.atributo-seleccionado');
    previouslySelectedAttribute.forEach((attribute) => {
      attribute.classList.remove('atributo-seleccionado');
    });

    //add class to the selected attribute
    const selectedAttribute = event.currentTarget;
    selectedAttribute.classList.add('atributo-seleccionado');

    console.log(dicePoolAttribute);
    updateDicePool1();
    updateDicePool1Label();
  });
});

//DICE POOL 2
const abilitiesPool = document.querySelectorAll('.abilities .form-group.attribute label');
let dicePool2 = {};

abilitiesPool.forEach((abilityPool) => {
  abilityPool.addEventListener('click', (event) => {
    const input = event.currentTarget.nextElementSibling.nextElementSibling;
    dicePoolAbility.name = capitalizeFirstLetter(input.getAttribute('name'));
    dicePoolAbility.die = input.getAttribute('value');
    
    //remove class from the previously selected ability
    const previouslySelectedAbility = document.querySelectorAll('.habilidad-seleccionada');
    previouslySelectedAbility.forEach((ability) => {
      ability.classList.remove('habilidad-seleccionada');
    });
        
    //add class to the selected ability
    const selectedAbility = event.currentTarget;
    selectedAbility.classList.add('habilidad-seleccionada');

    console.log(dicePoolAbility);
    updateDicePool2();
    updateDicePool2Label();
  });
});





////////// Borrar los inputs de los pools de dados al hacer click


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

function resetDicePool1() {
  document.querySelector("#dicePool1").value = "0";
  document.querySelector("#dicePool1Label").innerHTML = ("");

  //remove class from the previously selected attribute
  const previouslySelectedAttribute = document.querySelectorAll('.atributo-seleccionado');
  previouslySelectedAttribute.forEach((attribute) => {
    attribute.classList.remove('atributo-seleccionado');
  });
}
function resetDicePool2() {
  document.querySelector("#dicePool2").value = "0";
  document.querySelector("#dicePool2Label").innerHTML = ("");

  //remove class from the previously selected ability
  const previouslySelectedAbility = document.querySelectorAll('.habilidad-seleccionada');
  previouslySelectedAbility.forEach((ability) => {
    ability.classList.remove('habilidad-seleccionada');
  });

}
function resetDiceMod() {
  document.querySelector("#diceMod").value = "0";
}

function resetAllDice() {
  resetDicePool1();
  resetDicePool2();
  resetDiceMod();
  document.querySelector("#difficulty").value = 6;
} 

document.querySelector(".gg-trash").addEventListener("click", function() {
  resetAllDice();
});






// Poner en mayuscula la primera letra de un string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//funcion para actualizar el campo #dicePool1 con el valor guardado en la const dicePoolAttribute
function updateDicePool1() {
  console.log("updateDicePool1");
  document.querySelector("#dicePool1").value = dicePoolAttribute.die;
}

//funcion para actualizar el campo #dicePool2 con el valor guardado en la const dicePoolAbility
function updateDicePool2() {
  console.log("updateDicePool2");
  document.querySelector("#dicePool2").value = dicePoolAbility.die;
}

//funcion para actualizar el label #dicePool2Label con el valor 
//guardado en la const dicePoolAbility.name
function updateDicePool2Label() {
  console.log("updateDicePool2Label");
  document.querySelector("#dicePool2Label").innerHTML = dicePoolAbility.name;
}


//funcion para actualizar el label #dicePool1Label con el valor 
//guardado en la const dicePoolAttribute.name
function updateDicePool1Label() {
  console.log("updateDicePool1Label");
  document.querySelector("#dicePool1Label").innerHTML = dicePoolAttribute.name;
}