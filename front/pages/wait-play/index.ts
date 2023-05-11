import { Router } from "@vaadin/router";
import { state } from "../../state";

function initWaitPlayPage() {
   class WaitPlayPage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(this.startPlay);
      }

      connectedCallback() {
         const headerEl = document.createElement("header-comp");
         const textEl = document.createElement("text-comp");
         const buttonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");

         textEl.textContent = `Esperando a que el otro jugador presione Jugar`;

         buttonEl.setAttribute("text", "Volver");
         buttonEl.setAttribute("target", "/start");

         this.append(headerEl, textEl, buttonEl, moveSelectorEl);
      }

      startPlay() {
         const location = window.location.pathname == "/waitplay";
         const usersStart = state.checkBothUsersStart();

         if (location && usersStart) {
            Router.go("/counter");
         }
      }
   }
   customElements.define("wait-play-page", WaitPlayPage);
}

export { initWaitPlayPage };
