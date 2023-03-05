const ratings = document.querySelectorAll('.rating');

/// FUNCIONALIDAD DE LOS PUNTITOS AL HACER CLICK ///
////////////////////////////////////////////////////
// Loop through each rating element
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
      }
    });
  });
});

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
    //update helth squares
    updateHealthSquares()
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







