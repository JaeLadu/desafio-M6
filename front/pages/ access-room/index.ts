import { Router } from "@vaadin/router";
import { state } from "../../state";

function initAccessRoomPage() {
   class AccessRoomPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const titleEl = document.createElement("title-comp");
         titleEl.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const formEl = document.createElement("form-comp");
         formEl.setAttribute("fields", "Código");
         formEl.setAttribute("button", "Ingresar a la sala");
         formEl.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(formEl.querySelector("form"));
            formData.append("code", formData.get("Código"));
            const data = Object.fromEntries(formData.entries());

            const response = await state.accessRoom(data.code);

            if (response.firebaseId) {
               Router.go("/share");
            } else {
               console.log(response.messege);
            }
         });

         this.append(titleEl, formEl);
      }
   }
   customElements.define("access-room-page", AccessRoomPage);
}
export { initAccessRoomPage };
