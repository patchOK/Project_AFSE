// Variabili Generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString); 
let loginSuccess = false; 

// OnLoad della pagina
document.addEventListener("DOMContentLoaded", function() {
    localStorage.setItem("loggedInUser Email", "");
});

// Button: Accedi
document.getElementById("loginForm").addEventListener("submit", function(event) {
        
    // Evita il ricaricamento della pagina
    event.preventDefault();

    // trim() per eliminare eventuali spazi bianchi
    const emailInput = document.getElementById("loginEmail").value.trim();
    const passwordInput = document.getElementById("loginPassword").value.trim();

    // Controlla che savedUsers esista e sia un array
    if (savedUsers && Array.isArray(savedUsers)) {

        // Controlla se l'utente è registrato e le credenziali sono corrette
        for (let user of savedUsers) {
            if (user.email === emailInput && user.password === passwordInput) {
                loginSuccess = true; 
                localStorage.setItem("loggedInUser Email", emailInput);
                break;
            }
        }
    }

    if (loginSuccess) {
        alert("Login effettuato con successo!");
        window.location.href = "HTML_Home.html";  
    } else {
        alert("Email o Password non corretti.");
    }
});  
  
// Show Password
document.getElementById("showPassword").addEventListener("change", function() {
    let passwordField = document.getElementById("loginPassword");

    if (this.checked) {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});