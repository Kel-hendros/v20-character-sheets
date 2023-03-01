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



function toggleCollapse() {
  const container = document.querySelector('.container.info');
  container.classList.toggle('collapsed');
}


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

  // Loop through all input elements
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id;
    const value = input.value;

    // Check if the input has an ID and a value
    if (id && value) {
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
// Descargar el archivo ///
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
	};

	reader.readAsText(file);
});
	
