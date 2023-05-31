import { Router } from "@vaadin/router";
import { state } from "../../state";

function initShareCodePage() {
   class ShareCodePage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(this.enterRoom);
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
         const firstTextEl = document.createElement("text-comp");
         const secondTextEl = document.createElement("text-comp");
         const codeEl = document.createElement("h3");
         const backButtonEl = document.createElement("button-comp");
         const moveSelectorEl = document.createElement("move-selector-comp");
         const currentState = state.getState();

         firstTextEl.textContent = "Compartí el código:";
         codeEl.textContent = currentState.room.shortId;
         secondTextEl.textContent = "Con tu contrincante";
         backButtonEl.setAttribute("text", "Volver");
         backButtonEl.setAttribute("target", "/start");

         this.append(
            headerEl,
            firstTextEl,
            codeEl,
            secondTextEl,
            backButtonEl,
            moveSelectorEl
         );
      }

      enterRoom() {
         const location = window.location.pathname == "/share";
         const usersOnline = state.checkBothUsersOnline();

         if (location && usersOnline) {
            Router.go("/play");
         }
      }
   }

   customElements.define("share-code-page", ShareCodePage);
}

export { initShareCodePage };
