import { Router } from "@vaadin/router";
import { state } from "../../state";

function initPlayPage() {
   class PlayPage extends HTMLElement {
      constructor() {
         super();
      }

      onBeforeEnter() {
         const { databaseConnection } = state.getState();
         if (!databaseConnection) {
            state.updateRoomData();
         }
      }

      connectedCallback() {
         state.changeUserStatus({ connected: true, start: false });
         const headerEl = document.createElement("header-comp");
         const mainContainerEl = document.createElement("div");
         const textEl = document.createElement("text-comp");
         const playButtonEl = document.createElement("button-comp");
         const backButtonEl = document.createElement("button-comp");
         const moveSelectorContainerEl = document.createElement("div");
         const moveSelectorEl = document.createElement("move-selector-comp");
         const style = document.createElement("style");

         mainContainerEl.classList.add("main-container");

         textEl.textContent = `Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.`;

         playButtonEl.setAttribute("text", "Jugar");
         playButtonEl.addEventListener("click", (e) => {
            e.preventDefault();

            state.startUserPlay();

            Router.go("/waitplay");
         });

         backButtonEl.setAttribute("text", "Volver");
         backButtonEl.setAttribute("target", "/start");

         style.textContent = `
            play-page{
               height: 100vh;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
            }
            .main-container{
               display: flex;
               flex-direction: column;
               gap: 30px;
            }
         `;

         mainContainerEl.append(textEl, playButtonEl, backButtonEl);
         moveSelectorContainerEl.append(moveSelectorEl);
         this.append(headerEl, mainContainerEl, moveSelectorContainerEl, style);
      }
   }
   customElements.define("play-page", PlayPage);
}

export { initPlayPage };
