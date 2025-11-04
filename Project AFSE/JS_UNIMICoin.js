// Variabili generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

document.addEventListener("DOMContentLoaded", function () {
    if(checkLogin()){
        displaySaldo();
    }
    
    else{
        alert("Devi effettuare il Login!");
        window.location.href = "HTML_Login.html";
    }
});

// Check Login
function checkLogin(){
    if (userProfile) {return true}
    else {return false}
}

// Display Saldo attuale
function displaySaldo() {
    let saldoAttuale = userProfile.coin;
    document.getElementById("displaySaldo").textContent = "Saldo: " + saldoAttuale;
}

// Acquista
function buy() {

    let saldoAttuale = userProfile.coin;

    const quantita = parseInt(document.getElementById("quantita").value);

        saldoAttuale += quantita;
        userProfile.coin = saldoAttuale;
        localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
        displaySaldo();
    } 