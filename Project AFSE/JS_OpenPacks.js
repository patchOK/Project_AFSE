// Variabili Generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

const packContainer = document.getElementById("pack-container");
const packImg = document.getElementById("pack-img");
const cardsContainer = document.getElementById("cards-container");
let numeroBuste = 1;

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

// API Keys Marvel
const publicKey = "";
const privateKey = "";

// Generatore hash
function generateAuthParams() {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

// Fetch API Marvel: Basic Info

// async function per poter utilizzare await  e quindi attendere la risposta
async function fetchHeroData(heroName) {
    const authParams = generateAuthParams();
    const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(heroName)}&${authParams}`;

    // Fetch Api per ottenere dati eroe
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Controlla che che i dati siano presenti
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
document.addEventListener("DOMContentLoaded", function () {
    if(checkLogin()){
        albumExist();
        displaySaldo();

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

// Display saldo
function displaySaldo() {
    let saldoAttuale = userProfile.coin;
    document.getElementById("displaySaldo").textContent = "Saldo: " + saldoAttuale;
}

// Increase e Decrease Buste 
document.getElementById("displayNumeroBuste").textContent = numeroBuste;
document.getElementById("displayCosto").textContent = numeroBuste;

function decreaseQuantity() {
    if (numeroBuste > 1){
        numeroBuste--;
        document.getElementById("displayNumeroBuste").textContent = numeroBuste;
        document.getElementById("displayCosto").textContent = numeroBuste;
    }
    else{};
};

function increaseQuantity() {
    if (numeroBuste < 5){
        numeroBuste++;
        document.getElementById("displayNumeroBuste").textContent = numeroBuste;
        document.getElementById("displayCosto").textContent = numeroBuste;
    }
    else {alert("Massimo 5 Buste per volta!")};
};

// Randomizer carte in pack
function getRandomElements(array, n) {
    const result = [];

    // Crea una copia dell'array dato in input
    const copiedArray = [...array]; 
        
    for (let i = 0; i < n; i++) {
        if (copiedArray.length === 0) break;

        // Genera un indice casuale
        const randomIndex = Math.floor(Math.random() * copiedArray.length); 
        result.push(copiedArray[randomIndex]); 
        }   

    return result;
}
  
// Apertura pacchetto
async function openPack() {

    if (userProfile && userProfile.coin >= numeroBuste) {

    // Remove Pack
    document.getElementById("pack-container").remove();
    document.getElementById("costoContainer").remove();
    
    document.getElementById("titoloBusta").innerHTML = "Caricamento...";

    // Update dati utente
    userProfile.openedPacks += numeroBuste;
    userProfile.coin = userProfile.coin - numeroBuste;
    userProfile.cards += numeroBuste * 5;   
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));

    // Popolazione con carte trovate in busta    
    for (let i = 0; i < numeroBuste; i++) {
        
        const selectedHeroes = getRandomElements(heroNames, 5);
    
            let rowElement = document.createElement("div");
            rowElement.classList.add("row", "justify-content-center", "py-2" ,"mx-4");

            // Creazione della singola carta nel pack ripetuta per 5 volte
            for (const heroName of selectedHeroes) {
                const heroData = await fetchHeroData(heroName);

                if (heroData) {
                    const cardElement = document.createElement("div");
                    cardElement.classList.add("col", "m-2", "flip-card");
            
                    cardElement.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${heroData.image}" class="card-img" alt="${heroData.name}">
                        </div>
                        <div class="flip-card-back d-flex p-3">
                            <h5 class="card-title text-danger">${heroData.name}</h5>
                            <p class="card-text">${heroData.description}</p>
                        </div>
                    </div>
                    `;
            
                    cardElement.onclick = function () {
                        this.classList.toggle("flipped");
                    };
            
                    rowElement.appendChild(cardElement);
            
                    const heroIndex = heroNames.indexOf(heroName);

                    if (heroIndex !== -1) {
                        userProfile.album[heroIndex] += 1; 
                        localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
                    }
                }
            }
                
        cardsContainer.appendChild(rowElement);
        
        // Per poter visualizzare tutte le carte insieme una volta caricate
        cardsContainer.style.display = "none";
    }     

    // Updates post apertura: Saldo, Buttons e Titolo 
    let buttonRow = document.createElement("div");
    buttonRow.classList.add("row", "justify-content-center", "mb-4", "mt-4");

    let albumButtonCol = document.createElement("div");
    albumButtonCol.classList.add("col-auto");

    let albumButton = document.createElement("button");
    albumButton.classList.add("btn", "btn-lg", "btn-danger", "m-4", "border-2", "border-black");
    albumButton.textContent = "Vai all'Album";

    albumButton.onclick = function() {
        window.location.href = "HTML_Album.html";
    };

    albumButtonCol.appendChild(albumButton);
    buttonRow.appendChild(albumButtonCol);

    let openPackButtonCol = document.createElement("div");
    openPackButtonCol.classList.add("col-auto");

    let openPackButton = document.createElement("button");
    openPackButton.classList.add("btn", "btn-lg", "btn-danger", "m-4", "border-2", "border-black");
    openPackButton.textContent = "Apri altri Pack";

    openPackButton.onclick = function() {
        window.location.href = "HTML_OpenPacks.html"; 
    };

    document.getElementById("titoloBusta").innerHTML = "Fantastico!";

    openPackButtonCol.appendChild(openPackButton);
    buttonRow.appendChild(openPackButtonCol);

    cardsContainer.appendChild(buttonRow);
    cardsContainer.style.display = "block";

    displaySaldo();

    } else{alert("Crediti insufficienti!")}
}

