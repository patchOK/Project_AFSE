# Project AFSE
Il progetto si pone l’obiettivo di sviluppare l’applicazione web Album delle Figurine dei Super Eroi (AFSE), un sito di gestione di figurine elettroniche di super eroi. AFSE implementa un album elettronico di figurine con l’acquisto di pacchetti chiusi, il cui contenuto è ignoto, e la piattaforma per lo scambio di figurine tra giocatori.

Il primo macro-scenario è la gestione del profilo dell’utente, e consiste nella gestione classica di un profilo utente, con l’acquisizione dei dati principali, la loro modifica ed eventualmente anche la rimozione del profilo stesso. L’applicazione prevede perciò una fase di registrazione utente dove verranno collezionate informazioni quali nome utente, indirizzo email, password, super eroe preferito, una volta registrato, l’utente può collegarsi all’applicazione e creare un album di figurine inizialmente vuoto. 

Il secondo macro-scenario consiste nell’acquisto di pacchetti di figurine. A tale scopo, è stato necessario prevedere la gestione di un platfond di crediti virtuali che permettano di acquistare figurine. In particolare, l’utente acquista crediti sufficienti da poter utilizzare per comprare uno o più pacchetti di figurine. Ogni pacchetto contiene 5 figurine casuali e ogni figurina rappresenta un super eroe. 
L’elenco dei super eroi viene acquisito tramite le API REST del portale https://developer.marvel.com/docs. Per ogni super eroe sono state gestite le informazioni principali specificate di seguito.

L’ultimo scenario, è la gestione dello scambio di figurine, e prevede che la piattaforma fornisca uno spazio di scambio figurine dove ogni utente registrato può proporre le sue figurine doppie in cambio di figurine mancanti.

## Funzionalità Front-end:
1) Registrazione e login al sito;
2) Acquisto dei crediti;
3) Acquisto dei pacchetti di figurine;
4) Visualizzazione di informazioni relative a ogni supereroe;
5) Visualizzazione dei dati di dettaglio per ogni supereroe che è stato trovato;
6) Inserimento di possibili proposte di scambio nella piattaforma;
7) Visualizzazione degli scambi disponibili e accettazione di una proposta.

Allo startup dell’applicazione, tutti i dati necessari sono disponibili (in formato JSON), memorizzati nel local storage e visualizzati nell’applicazione web. Le pagine web sono state implementate utilizzando HTML5, CSS3 e JavaScript, e hanno un paradigma di separazione tra la struttura HTML e la rappresentazione CSS della pagina web.
