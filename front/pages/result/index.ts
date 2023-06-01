import { Router } from "@vaadin/router";
import { state } from "../../state";

const piedraImg = require("../../elements/piedra.svg");
const papelImg = require("../../elements/papel.svg");
const tijeraImg = require("../../elements/tijera.svg");

const movesMap = {
   piedra: piedraImg,
   papel: papelImg,
   tijera: tijeraImg,
};

function initResultPage() {
   class ResultPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         //Este timer determina que esta pantalla sólo va a ser visible por un cierto tiempo, después el router lleva a los usuarios a /score
         //esto es porque esta pantalla es únicamente para mostrar la jugada que eligió cada unos de los usuarios
         setTimeout(() => {
            Router.go("/score");
         }, 2000);

         const currentState = state.getState();
         const { currentPlay } = currentState.room;
         const user = currentState.user.id;
         //filtra en la lista de usuarios de la room, al que no es el mismo que el usuario local y guarda su id en una constante
         const opponent = currentState.room.users.find((u) => u.id !== user).id;

         const container = document.createElement("div");
         container.classList.add("container");

         const opponentMove = document.createElement("img");
         opponentMove.classList.add("opponent");
         opponentMove.setAttribute("src", movesMap[currentPlay[opponent].move]);

         const userMove = document.createElement("img");
         userMove.classList.add("user");

         userMove.setAttribute("src", movesMap[currentPlay[user].move]);

         const style = document.createElement("style");

         style.textContent = `

         .container{
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         }
         .opponent{
            height: 45vh;
            transform: rotate(180deg)
         }
         .user{
            height: 45vh;
         }
   `;

         container.append(opponentMove, userMove);
         this.append(container, style);
      }
   }
   customElements.define("result-page", ResultPage);
}
export { initResultPage };
