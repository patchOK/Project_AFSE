// Variabili Generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

const inputForm = document.getElementById("editProfilo");
const buttonSave = document.getElementById("saveMod");
const closeButton = document.getElementById("closeMod");

// OnLoad della pagina
document.addEventListener("DOMContentLoaded", function() {
    if(checkLogin()){
        showInfo();
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

// Show info
function showInfo(){
    document.getElementById("editUsername").placeholder = userProfile.username;
    document.getElementById("editEmail").placeholder = userProfile.email;
    document.getElementById("editHero").placeholder = userProfile.hero;
    document.getElementById("editPass").value = userProfile.password;
}

// Svuota campo PSW quando il campo è cliccato
document.getElementById("editPass").addEventListener("focus", function() {
    if (this.value === userProfile.password) {
        this.value = "";
    }
});

// PSW attualmente usata se campo lasciato vuoto
document.getElementById("editPass").addEventListener("blur", function() {
    if (this.value === "") {
        this.value = userProfile.password;
        this.type = "password";
    }
});

// Button: Show PSW
document.getElementById("showPassword").addEventListener("change", function() {
    let passwordField = document.getElementById("editPass");

    if (this.checked) {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});

// Button: Close
    closeButton.addEventListener("click", function(){
        window.location.href = "HTML_Profilo.html";  
    })

// Updates scambi post modifica account
function updateScambi(oldEmail, newEmail) {
    let exchanges = JSON.parse(localStorage.getItem("Scambi"));

    // .map crea un nuovo array trasformando ogni elemento di exchanges in base alla funzione passata 
    exchanges = exchanges.map(exchange => {
        if (exchange.utente === oldEmail) {
            exchange.utente = newEmail;
        }
        return exchange;
    });
    localStorage.setItem("Scambi", JSON.stringify(exchanges));
}

// Button: Save
buttonSave.addEventListener("click", function(event) {
    let resultU = confirm("Sei sicuro delle modifiche?")
        
    if(resultU){
        event.preventDefault();

        const nomeU = document.getElementById("editUsername").value.trim();
        const mailU = document.getElementById("editEmail").value.trim();
        const heroU = document.getElementById("editHero").value.trim();
        const passU = document.getElementById("editPass").value.trim();

        if (userProfile) {
            const oldEmail = userProfile.email; 
        
            if (nomeU !== "") userProfile.username = nomeU;
            if (mailU !== "") userProfile.email = mailU;
            if (heroU !== "") userProfile.hero = heroU;
            if (passU !== "") userProfile.password = passU;
            
            // Update proposte di scambio se email o nome modificati
            if (nomeU !== "" || mailU !== "") {
                updateScambi(oldEmail, userProfile.email);
            }
        }

        localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
        localStorage.setItem("loggedInUser Email", "");
        
        alert("Profilo modificato correttamente! \n\nRichiesto nuovo login.");
        window.location.href = "HTML_Login.html";
    }
});