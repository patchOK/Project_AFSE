// Variabili generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

const cardsContainer = document.getElementById("cards-container");
const cardsRow = document.getElementById("cards-row");

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
        popolateAllCards().then(() => {
            addClickEventToCards();
        });
    } 
    else{
        alert("Devi effettuare il Login!");
        window.location.href = "HTML_Login.html";
    }
});

// Check Login
function checkLogin(){
    if (userProfile) {
        return true;
    } else {
        console.error("Login check failed: userProfile is null");
        return false;
    }
}

// Fase 1: Popolazione Carte Completa e set del data-index da passare in Fase 2
async function popolateAllCards() {

    let rowElement = document.createElement("div");
    rowElement.classList.add("row", "justify-content-center", "mt-2", "mb-4", "mx-4");
    
    for (let i = 0; i < heroNames.length; i++) {
        const heroData = await fetchHeroData(heroNames[i]);

        if (heroData) {
            const cardElement = document.createElement("div");
            cardElement.classList.add("col", "m-2", "flip-card");
            cardElement.setAttribute("data-index", i);

            cardElement.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${heroData.image}" class="card-img">
                    </div>
                </div>
            `;

            rowElement.appendChild(cardElement);

            // Aggiungi la riga al contenitore e crea una nuova riga ogni 5 carte
            if ((i + 1) % 5 === 0) {
                cardsRow.appendChild(rowElement);
                rowElement = document.createElement("div");
                rowElement.classList.add("row", "justify-content-center", "mt-2", "mb-4", "mx-4");
            }
        }
    }
}

// Fase 1.5: Evento Click Carte Desiderate into Fase 2
function addClickEventToCards() {
    const cards = document.querySelectorAll(".flip-card");
    cards.forEach(card => {
        card.addEventListener("click", function() {
            showDoubleCards(card.getAttribute("data-index"));
        });
    });
}

// Fase 2: Mostra Doppie da Scambiare e prende in input index della carta desiderata in Fase 1
async function showDoubleCards(selectedIndex) {

    document.querySelector("h1").textContent = "Quale doppia vuoi scambiare?";
    cardsRow.innerHTML = '';

    let rowElement = document.createElement("div");
    rowElement.classList.add("row", "justify-content-center", "mt-2", "mb-4", "mx-4");

    const cardElements = [];

    for (let i = 0; i < heroNames.length; i++) {

        if (userProfile.album[i] > 1) {

            const heroData = await fetchHeroData(heroNames[i]);

            if (heroData) {
                const cardElement = document.createElement("div");
                cardElement.classList.add("col", "m-2", "flip-card");
                cardElement.setAttribute("data-index", i);

                cardElement.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${heroData.image}" class="card-img" alt="${heroData.name}">
                        </div>
                    </div>
                `;

                cardElements.push(cardElement);
                rowElement.appendChild(cardElement);

                // Aggiungi la riga al contenitore e crea una nuova riga ogni 5 carte
                if ((rowElement.children.length) % 5 === 0) {
                    cardsRow.appendChild(rowElement);
                    rowElement = document.createElement("div");
                    rowElement.classList.add("row", "justify-content-center", "mt-2", "mb-4", "mx-4");
                }
            }
        }
    }

    // Div vuoti per riempire la riga se ha meno di 5 carte
    while (rowElement.children.length > 0 && rowElement.children.length < 5) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("col", "m-2");
        rowElement.appendChild(emptyDiv);
    }

    // Aggiungi la riga al contenitore solo se contiene almeno un elemento
    if (rowElement.children.length > 0) {
        cardsRow.appendChild(rowElement);
    }

    // Fase 2.5: Evento Click Carte Doppie into Fase 3
    cardElements.forEach(cardElement => {
        cardElement.addEventListener("click", function() {
            confirmExchange(selectedIndex, cardElement.getAttribute("data-index"));
        });
    });
}

// Fase 3: Conferma dello Scambio prendendo in input i due index di Fase 1 e Fase 2
async function confirmExchange(index1, index2) {

    document.querySelector("h1").textContent = "Confermi la proposta?";
    cardsRow.innerHTML = '';

    const heroData1 = await fetchHeroData(heroNames[index1]);
    const heroData2 = await fetchHeroData(heroNames[index2]);

    const card1 = `
        <div class="col m-2 flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${heroData1.image}" class="card-img" alt="${heroData1.name}">
                </div>
            </div>
        </div>
    `;

    const card2 = `
        <div class="col m-2 flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${heroData2.image}" class="card-img" alt="${heroData2.name}">
                </div>
            </div>
        </div>
    `;

    const confirmButton = `
        <button id="confirmButton" class="btn btn-lg btn-success border-black border-4 m-4">Conferma</button>
    `;

    const cancelButton = `
        <button id="cancelButton" class="btn btn-lg btn-danger border-black border-4 m-4">Annulla</button>
    `;

    // Struttura HTML della Conferma Scambio
    cardsRow.innerHTML = `
        <div class="row justify-content-center mt-2 mb-4 mx-4">
            ${card1}

            <div class="col m-2 d-flex align-items-center justify-content-center">
                <h1 class="fw-bold">⇄</h1>
            </div>

            ${card2}
        </div>

        <div class="row justify-content-center mt-2 mb-4 mx-4">
            ${confirmButton}
            ${cancelButton}
        </div>
    `;

    document.getElementById("confirmButton").addEventListener("click", function() {
        saveExchange(index1, index2);
    });

    document.getElementById("cancelButton").addEventListener("click", function() {
        location.reload();
    });
}

// Salva lo Scambio
function saveExchange(index1, index2) {

    let exchanges = JSON.parse(localStorage.getItem("Scambi")) || [];

    exchanges.push({
        indexCarta1: index1,
        indexCarta2: index2,
        utente: loggedInUserEmail
    });

    userProfile.album[index2] -= 1;

    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers));
    localStorage.setItem("Scambi", JSON.stringify(exchanges));

    alert("Proposta di Scambio Riuscita!");
    window.location.href = "HTML_Scambi.html";
}