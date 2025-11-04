// Variabili generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

const proposteContainer = document.getElementById("proposte-container");

// API Keys Marvel
const publicKey = "";
const privateKey = "";


// 65 Heroes
const heroNames = [
    "3-D Man", "Abyss", "Bastion", "Beast", "Bishop",  
    "Black Cat", "Black Panther", "Black Widow", "Bullseye", "Captain America",  
    "Captain Britain", "Carnage", "Cloak", "Colossus", "Cyclops",  
    "Daredevil", "Dark Beast", "Darkhawk", "Deadpool", "Doctor Doom",  
    "Doctor Strange", "Domino", "Dracula", "Drax", "Elektra",  
    "Emma Frost", "Falcon", "Firestar", "Forge", "Gambit",  
    "Groot", "Havok", "Hawkeye", "Hulk", "Iceman",  
    "Invisible Woman", "Iron Man", "Kingpin", "Kitty Pryde", "Loki",  
    "Magneto", "Medusa", "Mystique", "Nightcrawler", "Nova",  
    "Polaris", "Prodigy", "Professor X", "Psylocke", "Punisher",  
    "Quicksilver", "Red Hulk", "Rocket Raccoon", "Rogue", "Scarlet Witch",  
    "Silver Surfer", "Storm", "Thanos", "Thing", "Thor",  
    "Vision", "Wasp", "Winter Soldier", "Wolverine", "X-23"
];

// Generatore hash
function generateAuthParams() {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

// Fetch a Marvel.com
async function fetchHeroData(heroName) {
    const authParams = generateAuthParams();
    const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(heroName)}&${authParams}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.results.length > 0) {
            const hero = data.data.results[0];
            return {
                name: hero.name,
                image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
                description: hero.description || "Descrizione non disponibile."
            };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
    return null;
}

// OnLoad della pagina
document.addEventListener("DOMContentLoaded", function() {
    if(checkLogin()){ 
        albumExist();
        loadProposteScambio();
    } else{
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

// Check se esiste album
function albumExist(){
    if (!userProfile.album) {
        alert("Per aprire bustine devi prima creare un album!");
        window.location.href = ("HTML_Album.html");
    }
}

// Button: Add Proposta
let scambio = document.getElementById("scambi");
scambio.addEventListener("click", function() {

    const hasDoubleCards = userProfile.album.some(copie => copie > 1);

    if (!hasDoubleCards) {
        alert("Non hai carte doppie da scambiare!");
        return;
    }
    
    window.location.href = "HTML_AddScambio.html";
});

// Load delle Proposte
function loadProposteScambio() {
    let exchanges = JSON.parse(localStorage.getItem("Scambi")) || [];

    exchanges.forEach((exchange, index) => {
        const heroData1 = fetchHeroData(heroNames[exchange.indexCarta1]);
        const heroData2 = fetchHeroData(heroNames[exchange.indexCarta2]);
        const user1 = savedUsers.find(user => user.email === exchange.utente);

        // Promise.all: Accetta un array di promesse e restituisce una nuova promessa quando tutte le promesse nell'array sono state risolte
        Promise.all([heroData1, heroData2]).then(values => {
            const [hero1, hero2] = values;

            const propostaCard = document.createElement("div");
            propostaCard.classList.add("proposta-card");

            propostaCard.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-3 d-flex justify-content-center">
                        <img src="${hero1.image}" alt="${hero1.name}" class="img-fluid bordo-img">
                    </div>
                    <div class="col-md-3 text-center">
                        <h5>Desidera: ${hero1.name}</h5>
                        <h5>⇄</h5>
                        <h5>Per: ${hero2.name}</h5>
                        <p>Proposto da: ${user1.username}</p>
                    </div>
                    <div class="col-md-3 d-flex justify-content-center">
                        <img src="${hero2.image}" alt="${hero2.name}" class="img-fluid bordo-img">
                    </div>
                    <div class="col-md-3 d-flex justify-content-center">
                        <button class="btn btn-success accetta border-black border-2 p-4" data-index="${index}">Accetta</button>
                    </div>
                </div>
            `;

            proposteContainer.appendChild(propostaCard);
            
            // Button: Accetta
            propostaCard.querySelector(".accetta").addEventListener("click", function() {              
                accettaProposta(index);
            });

        });
    });
}

// Accetta Proposta con index dello scambio passato da loadProposteScambio()
function accettaProposta(index) {
    let exchanges = JSON.parse(localStorage.getItem("Scambi"));
    const exchange = exchanges[index];
    let user1 = savedUsers.find(user => user.email === exchange.utente);
    let user2 = userProfile;

    if (exchange.utente === loggedInUserEmail) {
        alert("Non puoi accettare le tue proposte!");
        return;
    }

    if (user2.album[exchange.indexCarta1] <= 1) {
        alert("Non puoi accettare lo scambio perché non hai abbastanza copie della carta.");
        return;
    }

    user2.album[exchange.indexCarta1] -= 1;
    user1.album[exchange.indexCarta1] += 1;
    user2.album[exchange.indexCarta2] += 1;
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));

    // Con splice dallo scambio all'index specificato ne elimina 1
    exchanges.splice(index, 1);
    localStorage.setItem("Scambi", JSON.stringify(exchanges));

    alert("Scambio accettato!");
    location.reload();
}