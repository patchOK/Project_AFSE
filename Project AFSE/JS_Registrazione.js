// Variabili Generali
const registrationForm = document.getElementById("registrationForm");

// OnLoad della pagina
document.addEventListener("DOMContentLoaded", function () {
    localStorage.setItem("loggedInUser Email", "");
})

// Button: Registrati
registrationForm.addEventListener("submit", function(event) {

    // Evita il ricaricamento della pagina
    event.preventDefault();  

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const hero = document.getElementById("hero").value;

    let savedUsers = JSON.parse(localStorage.getItem("User_Profiles")) || [];

    // Controllo se mail già usata
    const emailExists = savedUsers.some(user => user.email === email);
    
    if (emailExists) {
        alert("Questa Email è già in uso.");
        return;
    }

    const user = {
        username: username,
        email: email,
        password: password,
        hero: hero,
        coin: 0,
        openedPacks: 0,
        cards: 0
    };

    savedUsers.push(user);
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));

    alert("Registrazione completata con successo!");
    window.location.href = "HTML_Login.html";
});

// Show Password
document.getElementById("showPassword").addEventListener("change", function() {
    let passwordField = document.getElementById("password");

    if (this.checked) {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});