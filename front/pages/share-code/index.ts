import { state } from "../../state";

function initShareCodePage() {
   class ShareCodePage extends HTMLElement {
      constructor() {
         super();
      }

      onBeforeEnter(location, commands, router) {
         const usersOnline = state.checkBothUsersOnline();
         if (usersOnline) {
            return commands.redirect("/play");
         }
      }

      connectedCallback() {
         const headerEl = document.createElement("header-comp");
         const firstTextEl = document.createElement("text-comp");
         const secondTextEl = document.createElement("text-comp");
         const codeEl = document.createElement("h3");
         const moveSelectorEl = document.createElement("move-selector-comp");
         const currentState = state.getState();

         firstTextEl.textContent = "Compartí el código:";
         codeEl.textContent = currentState.room.shortId;
         secondTextEl.textContent = "Con tu contrincante";

         this.append(
            headerEl,
            firstTextEl,
            codeEl,
            secondTextEl,
            moveSelectorEl
         );
      }
   }

   customElements.define("share-code-page", ShareCodePage);
}

export { initShareCodePage };
