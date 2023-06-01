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
         const mainContainerEl = document.createElement("div");
         const firstTextEl = document.createElement("text-comp");
         const secondTextEl = document.createElement("text-comp");
         const codeEl = document.createElement("strong-text-comp");
         const backButtonEl = document.createElement("button-comp");
         const moveSelectorContainerEl = document.createElement("div");
         const moveSelectorEl = document.createElement("move-selector-comp");
         const currentState = state.getState();
         const style = document.createElement("style");

         firstTextEl.textContent = "Compartí el código:";
         codeEl.textContent = currentState.room.shortId;
         secondTextEl.textContent = "Con tu contrincante";
         backButtonEl.setAttribute("text", "Volver");
         backButtonEl.setAttribute("target", "/start");
         moveSelectorContainerEl.append(moveSelectorEl);
         mainContainerEl.classList.add("main-container");
         mainContainerEl.append(
            firstTextEl,
            codeEl,
            secondTextEl,
            backButtonEl
         );

         style.textContent = `
            share-code-page{
               height: 100vh;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
            }
            .main-container{
               text-align: center;
               display: flex;
               flex-direction: column;
               gap: 20px;
            }
         `;

         this.append(headerEl, mainContainerEl, moveSelectorContainerEl, style);
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
