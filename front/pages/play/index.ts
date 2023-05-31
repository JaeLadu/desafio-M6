import { Router } from "@vaadin/router";
import { state } from "../../state";

function initPlayPage() {
   class PlayPage extends HTMLElement {
      constructor() {
         super();
      }

      onBeforeEnter() {
         const { databaseConnection } = state.getState();
         console.log(databaseConnection);

         if (!databaseConnection) {
            state.updateRoomData();
         }
      }

      connectedCallback() {
         const headerEl = document.createElement("header-comp");
         const textEl = document.createElement("text-comp");
         const playButtonEl = document.createElement("button-comp");
         const backButtonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");

         textEl.textContent = `Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.`;

         playButtonEl.setAttribute("text", "Jugar");
         playButtonEl.addEventListener("click", (e) => {
            e.preventDefault();

            state.startUserPlay();

            Router.go("/waitplay");
         });

         backButtonEl.setAttribute("text", "Volver");
         backButtonEl.setAttribute("target", "/start");

         this.append(
            headerEl,
            textEl,
            playButtonEl,
            backButtonEl,
            moveSelectorEl
         );
      }
   }
   customElements.define("play-page", PlayPage);
}

export { initPlayPage };
