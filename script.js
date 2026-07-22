document.addEventListener('DOMContentLoaded', function() {

    //checks that all of the required input boxes are filled in
    function isEmpty(button, form, msg) {
        button.addEventListener("click", function() {
        msg.innerHTML = "";
        for (let element of form.elements) {
            if (element.value == "" && element.name != "" && element.name != "mood") {
                msg.innerHTML = element.name + " is empty";
                break;
            }
            else if (element.name == "warmth" && (element.value > 5 || element.value < 1)) {
                msg.innerHTML = element.name + " must be a value from 1-5";
                break;
            }
        }
        })
    }

    async function getAIOutfitAdvice(userRequestText) {
       try {
        // Sends data to your local Node server running on port 3000
        const response = await fetch("http://localhost:3000/api/generate-outfit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: userRequestText })
        });

        const data = await response.json();
        
        if (data.text) {
            console.log("Gemini says:", data.text);
            // Example: Display it on your screen somewhere:
            // document.getElementById("aiResponseBox").textContent = data.text;
        } else {
            console.error("Error from AI:", data.error);
        }

    } catch (error) {
        console.error("Could not reach backend:", error);
    } 
    }

    isEmpty(submitClosetButton, formCloset, emptyClosetElement);
    isEmpty(submitOutfitButton, formOutfit, emptyOutfitElement);
    
    //adds new clothing items to the closet
    submitClosetButton.addEventListener("click", function() {
        const template = document.getElementById("templateCloset");
        const clothingItem = template.content.firstElementChild.cloneNode(true);
        clothingItem.querySelector("#templateClosetName").textContent = document.querySelector("#name").value;
        clothingItem.querySelector("#templateClosetCategory").textContent = document.querySelector("#category").value;
        clothingItem.querySelector("#circle").style.backgroundColor = document.querySelector("#color").value;
        document.querySelector("#listOutfit").append(clothingItem);
    })

    submitOutfitButton.addEventListener("click", function() {
        let userRequestText= "Please suggest an outfit based on these parameters: "
        for (let element of formOutfit.elements) {
            if (element.value != "" && element.name != "") {
                const labelText = element.labels && element.labels[0] ? element.labels[0].textContent : element.name;
                userRequestText += (labelText + ": " + element.value + ", ");
            }
        }
        getAIOutfitAdvice(userRequestText)
    })
});