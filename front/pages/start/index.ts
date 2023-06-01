import { Router } from "@vaadin/router";
import { state } from "../../state";

function initStart() {
   class StartPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         state.changeUserStatus({ connected: false, start: false });
         const titleEl = document.createElement("title-comp");
         titleEl.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const newRoomButtonEl = document.createElement("button-comp");
         const accesRoomButtonEl = document.createElement("button-comp");
         const changeUserButtonEl = document.createElement("button-comp");

         newRoomButtonEl.setAttribute("text", "Nuevo Juego");
         accesRoomButtonEl.setAttribute("text", "Ingresar a una sala");
         changeUserButtonEl.setAttribute("text", "Cambiar de Usuario");

         newRoomButtonEl.addEventListener("click", async (e) => {
            await state.createNewRoom();
            Router.go("/share");
         });

         accesRoomButtonEl.setAttribute("target", "/accesroom");

         changeUserButtonEl.addEventListener("click", (e) => {
            state.clearLocalStorage();
            Router.go("/");
         });

         const moveSelectorEl = document.createElement("move-selector-comp");

         const containerEl = document.createElement("div");
         containerEl.classList.add("container");

         const style = document.createElement("style");
         style.textContent = `
            .container{
               height: 100vh;
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

         containerEl.append(
            titleEl,
            newRoomButtonEl,
            accesRoomButtonEl,
            changeUserButtonEl,
            moveSelectorEl
         );
         this.append(containerEl, style);
      }
   }
   customElements.define("start-page", StartPage);
}
export { initStart };
