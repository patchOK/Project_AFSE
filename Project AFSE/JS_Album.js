// Variabili generali
let userProfilesString = localStorage.getItem("User_Profiles");
const savedUsers = JSON.parse(userProfilesString);
const loggedInUserEmail = localStorage.getItem("loggedInUser Email");
let userProfile = savedUsers.find(user => user.email === loggedInUserEmail);

const createAlbumButton = document.getElementById("createAlbumButton");
const cardsContainer = document.getElementById("cards-container");

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

// Fetch API Marvel: More Info
async function fetchAdditionalHeroData(heroName) {
    const authParams = generateAuthParams();
    const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(heroName)}&${authParams}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.results.length > 0) {
            const hero = data.data.results[0];
            return {
                series: hero.series.items,
                events: hero.events.items,
                comics: hero.comics.items
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
        
        // Controlla se il profilo utente ha un campo album    
        if (userProfile && !userProfile.album) {
            createAlbumButton.style.display = "block";
            cardsContainer.style.display = "none";
        } else {
            createAlbumButton.style.display = "none";
            cardsContainer.style.display = "block";     
            popolateCards();
            collection();
        }
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

// Aggiungi l'evento di click per girare le carte
const flipCards = document.querySelectorAll(".flip-card-inner");
flipCards.forEach(card => {
    card.onclick = function () {
        // Rimuove il toggle del flip se è presente e lo adda se non è presente
        this.classList.toggle("flipped");
    };
});

// More info 
async function moreInfo(heroName, card) {
    const additionalData = await fetchAdditionalHeroData(heroName);
    if (additionalData) {

        const { series, events, comics } = additionalData;

        // Popola HTML con info di Serie, Eventi e Comics
        let content = "<h2 class='fw-bold text-decoration-underline'>Serie</h2><ul>";
        series.forEach(item => {
            content += `<li>${item.name}</li>`;
        });

        content += "</ul><hr class='border-3'><h2 class='fw-bold text-decoration-underline'>Eventi</h2><ul>";
        events.forEach(item => {
            content += `<li>${item.name}</li>`;
        });

        content += "</ul><hr class='border-3'><h2 class='fw-bold text-decoration-underline'>Comics</h2><ul>";
        comics.forEach(item => {
            content += `<li>${item.name}</li>`;
        });
        
            content += "</ul>";
            showModal(content);
        }
    }

// Funzione per mostrare modal
function showModal(content) {
        const modal = document.createElement("div");

        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content bg-dark text-light">
                <button class="close-button fw-bold btn btn-lg btn-danger rounded-circle position-absolute top-0 end-0 m-3">&times;</button>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = "block";

        modal.querySelector(".close-button").onclick = function () {
            modal.style.display = "none";
            document.body.removeChild(modal);
        };
    }

// Creazione Album di Figurine
createAlbumButton.addEventListener("click", function() {
    let album = new Array(65).fill(0); 
    userProfile.album = album; 
    localStorage.setItem("User_Profiles", JSON.stringify(savedUsers)); 

    createAlbumButton.style.display = "none";
    cardsContainer.style.display = "block";
    alert("Album creato con successo!");
    collection();
});

// Popolazione Carte possedute in album
    function popolateCards() {
        for (let i = 0; i < 65; i++) {
            const card = document.getElementById("card" + i);
            const collezionata = userProfile.album[i];

            if (collezionata > 0) {
                fetchHeroData(heroNames[i]).then(hero => {
                    if (hero) {

                        // querySelector prende il primo elemento che corrisponde al selettore
                        card.querySelector(".flip-card-front img").src = hero.image;
                        card.querySelector(".flip-card-back .card-title").textContent = hero.name;
                        card.querySelector(".flip-card-back .card-text").textContent = hero.description;
                        card.setAttribute("data-hero-name", hero.name);
                        card.querySelector("#copie").textContent = "Numero copie: " + collezionata;
                        card.querySelector(".scopri-piu").style = "display: block;";
                    }
                });
            }
        }

// Button: Scopri di più
let scopriDiPiuButtons = document.querySelectorAll(".scopri-piu");
scopriDiPiuButtons.forEach(button => {
        button.onclick = function (event) {
            event.stopPropagation(); // Evita che il click si propagi ad altri elementi vicini
            const card = event.target.closest(".flip-card-inner");
            const heroName = card.getAttribute("data-hero-name");
            moreInfo(heroName, card); // Passa il nome dell'eroe e la carta alla funzione moreInfo
            };
        });
    }

// Button: Scambio
let scambio = document.getElementById("scambi");
scambio.addEventListener("click", function() {

    if(!userProfile.album){
        alert("Devi prima creare un album!");
        return;
    }

    window.location.href = "HTML_Scambi.html"
});

// Conta carte in collezione
function collection(){
    let numeroCarte = 0;
    for(let i=0; i<65; i++){
        if(userProfile.album[i] > 0){
            numeroCarte += 1;
        }     
    }  
    document.getElementById("displayComplete").textContent = numeroCarte + " / 65";
};