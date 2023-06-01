import { Router } from "@vaadin/router";
import { state } from "../../state";

function initWaitPlayPage() {
   class WaitPlayPage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(this.startPlay);
      }

      onBeforeEnter() {
         const { databaseConnection } = state.getState();
         if (!databaseConnection) {
            state.updateRoomData();
         }
      }

      connectedCallback() {
         state.changeUserStatus({ start: true, connected: true });
         this.startPlay();
         const currentState = state.getState();
         const userId = currentState.user.id;
         const opponent = currentState.room.users.find(
            (user) => user.id != userId
         );

         const headerEl = document.createElement("header-comp");
         const mainContainerEl = document.createElement("div");
         const textEl = document.createElement("text-comp");
         const buttonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");

         mainContainerEl.classList.add("main-container");

         textEl.textContent = `Esperando a que ${opponent.name} presione Jugar`;

         buttonEl.setAttribute("text", "Volver");
         buttonEl.setAttribute("target", "/start");

         const style = document.createElement("style");
         style.textContent = `
            wait-play-page{
               height: 100vh;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
               
            }
            .main-container{
               display: flex;
               flex-direction: column;
               gap:20px;

            }
            @media screen and (min-width: 440px){
               .main-container{
                  max-width: 65vw;
                  margin: auto;
               }

         `;

         mainContainerEl.append(textEl, buttonEl);
         this.append(headerEl, mainContainerEl, moveSelectorEl, style);
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
