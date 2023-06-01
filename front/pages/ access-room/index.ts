import { Router } from "@vaadin/router";
import { state } from "../../state";

function initAccessRoomPage() {
   class AccessRoomPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         state.changeUserStatus({ connected: false, start: false });

         const titleEl = document.createElement("title-comp");
         titleEl.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const formEl = document.createElement("form-comp");
         formEl.setAttribute("fields", "Código");
         formEl.setAttribute("button", "Ingresar a la sala");
         formEl.shadowRoot.addEventListener(
            "customSubmit",
            async (e: CustomEvent) => {
               const formData = e.detail;
               formData.append("code", formData.get("Código"));
               const data = Object.fromEntries(formData.entries());

               const response = await state.accessRoom(
                  data.code.toString().toUpperCase()
               );

               if (response.shortId) {
                  Router.go("/share");
               }
               if (response.status) {
                  Router.go("/roomerror");
               }
            }
         );

         const backButtonEl = document.createElement("button-comp");
         backButtonEl.setAttribute("text", "Volver");
         backButtonEl.setAttribute("target", "/start");

         const style = document.createElement("style");
         style.textContent = `
            access-room-page{
               display: flex;
               flex-direction: column;
               gap: 20px;
            }
         `;
         this.append(titleEl, formEl, backButtonEl, style);
      }
   }
   customElements.define("access-room-page", AccessRoomPage);
}
export { initAccessRoomPage };
