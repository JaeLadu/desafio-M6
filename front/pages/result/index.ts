const piedraImg = require("../../elements/piedra.svg");
const papelImg = require("../../elements/papel.svg");
const tijeraImg = require("../../elements/tijera.svg");
import { handleRoute } from "../../router";
import { state } from "../../state";

function mountResult(root) {
   setTimeout(() => {
      history.pushState({}, "", "/score");
      handleRoute(location.pathname);
   }, 2000);

   const result = state.getResult();

   const container = document.createElement("div");
   container.classList.add("container");

   const computerMove = document.createElement("img");
   computerMove.classList.add("computer");

   if (result["computerMove"] == "piedra") {
      computerMove.setAttribute("src", piedraImg);
   }
   if (result["computerMove"] == "papel") {
      computerMove.setAttribute("src", papelImg);
   }
   if (result["computerMove"] == "tijera") {
      computerMove.setAttribute("src", tijeraImg);
   }

   const playerMove = document.createElement("img");
   playerMove.classList.add("player");

   if (result["playerMove"] == "piedra") {
      playerMove.setAttribute("src", piedraImg);
   }
   if (result["playerMove"] == "papel") {
      playerMove.setAttribute("src", papelImg);
   }
   if (result["playerMove"] == "tijera") {
      playerMove.setAttribute("src", tijeraImg);
   }

   const style = document.createElement("style");

   style.textContent = `
   .container{
    width:100%;
   }
    .computer{
       height:50vh;
       position: absolute;
       top: -15px;
       transform: rotate(180deg);
    }
    .player{
       height:50vh;
       position: absolute;
    bottom: -15px;
   }
   `;

   root.innerHTML = "";
   root.append(computerMove, playerMove, style);
}
export { mountResult };
