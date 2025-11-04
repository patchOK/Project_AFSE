// Variabili generali
let userProfilesString = localStorage.getItem("User_Profiles");
let savedUsers = JSON.parse(userProfilesString);
let loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

// OnLoad della pagina
document.addEventListener("DOMContentLoaded", function() {
    if(checkLogin()){
        showData();
        collectionPerc();
    } 
    
    else{
        alert("Devi effettuare il Login!");
        window.location.href = "HTML_Login.html";
    }
});

// Check Login
function checkLogin(){
    if (userProfile) {return true
    }
    else {return false}
}

// Show dati User
function showData(){
    document.getElementById("displayUsername").textContent = userProfile.username;
    document.getElementById("displayHero").textContent = userProfile.hero;
    document.getElementById("displayCards").textContent = userProfile.cards;
    document.getElementById("displayBuste").textContent = userProfile.openedPacks;
    document.getElementById("displayCoin").textContent = userProfile.coin;
}

// Percentuale Collezione
function collectionPerc(){
    let numeroCarte = 0;

    for(let i=0; i<65; i++){
        if(userProfile.album[i] > 0){
            numeroCarte += 1;
        }  
    }
    const percent = (numeroCarte/65)*100;
    document.getElementById("displayComplete").textContent = percent.toFixed(0) + "%";
};

// Button: Modifica
buttonMod = document.getElementById("editProfileButton");

buttonMod.addEventListener("click", function() {
    window.location.href = "HTML_ModificaProfilo.html"; 
});

// Button: Elimina
buttonCanc = document.getElementById("deleteProfileButton");

buttonCanc.addEventListener("click", function () {
    if (confirm("Sei sicuro di eliminare il profilo?")) {

        // filter crea un nuovo array includendo solo gli elementi che soddisfano la condizione, quindi un array che non include l'utente loggato che sta eliminando il profilo
        savedUsers = savedUsers.filter(user => user.email !== loggedInUserEmail);     

        localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));

        localStorage.setItem("loggedInUser Email", "");


        let scambi = JSON.parse(localStorage.getItem("Scambi"));
        scambi = scambi.filter(scambi => scambi.utente !== loggedInUserEmail);
        localStorage.setItem("Scambi", JSON.stringify(scambi));

        alert("Profilo eliminato.");
        window.location.href = "HTML_Login.html";
    }
});

// Button: Logout
logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function() {

    let resultC = confirm("Vuoi effettuare il Logout? Tornerai alla schermata di Login.")
        
    if(resultC){
        localStorage.setItem("loggedInUser Email", "");
        window.location.href = "HTML_Login.html";
    }
});

// Funzioni di servizio per testing
function zero(){
    for(let i=0; i<65; i++){
        userProfile.album[i] = 0;
        }       
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
}

function uno(){
    for(let i=0; i<65; i++){
        userProfile.album[i] = 1;
        }
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
}

function god(){
    for(let i=0; i<65; i++){
        userProfile.album[i] = 99;
        }
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
}