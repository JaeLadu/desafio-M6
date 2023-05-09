import { Router } from "@vaadin/router";
import { state } from "../../state";

function initRoomError() {
   class RoomErrorPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const currentState = state.getState();
         const title = document.createElement("title-comp");
         title.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const message = document.createElement("text-comp");
         message.textContent = currentState.room;

         const button = document.createElement("button-comp");
         button.setAttribute("text", "Volver");
         button.setAttribute("target", "/accesroom");

         const moveSelector = document.createElement("move-selector-comp");

         const container = document.createElement("div");
         container.classList.add("container");

         const style = document.createElement("style");
         style.textContent = `
         .container{
            min-height: 80vh;
            width: 100%;
            display: flex;
            flex-direction: column; 
            align-items: center;
            justify-content: space-between;
            gap: 5vh;
         }
         @media screen and (min-width: 400px){
            .container{
               width: 375px;
            }
            button-comp{
               width: 100%
            }
            move-selector-comp{
               width: 100%
            }
         }
         `;

         container.append(title, message, button, moveSelector);
         this.append(container, style);
      }
   }
   customElements.define("room-error-page", RoomErrorPage);
}
export { initRoomError };
