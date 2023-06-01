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
         const textEl = document.createElement("text-comp");
         const buttonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");

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
         `;

         this.append(headerEl, textEl, buttonEl, moveSelectorEl, style);
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
