import { Router } from "@vaadin/router";
import { state } from "../../state";

function initPlayPage() {
   class PlayPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const headerEl = document.createElement("header-comp");
         const textEl = document.createElement("text-comp");
         const buttonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");

         textEl.textContent = `Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.`;

         buttonEl.setAttribute("text", "Jugar");
         buttonEl.addEventListener("click", (e) => {
            e.preventDefault();

            state.startUserPlay();

            Router.go("/waitplay");
         });

         this.append(headerEl, textEl, buttonEl, moveSelectorEl);
      }
   }
   customElements.define("play-page", PlayPage);
}

export { initPlayPage };
