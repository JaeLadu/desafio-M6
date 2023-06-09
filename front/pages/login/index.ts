import { Router } from "@vaadin/router";
import { state } from "../../state";

function initLogin() {
   class LoginPage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(() => this.connectedCallback);
      }

      onBeforeEnter(location, commands, router) {
         const currentState = state.getState();
         if (currentState.user.id) {
            return commands.redirect("/start");
         }
      }

      connectedCallback() {
         const title = document.createElement("title-comp");
         title.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const formEl = document.createElement("form-comp");
         formEl.setAttribute("fields", "Tu nombre,Tu mail");
         formEl.setAttribute("button", "Ingresar");
         //escucho un evento custom porque el elemento form-comp está dentro de un shadow
         formEl.shadowRoot.addEventListener(
            "customSubmit",
            async (e: CustomEvent) => {
               //form-comp manda el formData dentro del detalle del evento custom
               const formData = e.detail;
               formData.append("name", formData.get("Tu nombre"));
               formData.append(
                  "mail",
                  formData.get("Tu mail").toString().toLocaleLowerCase()
               );
               formData.delete("Tu nombre");
               formData.delete("Tu mail");
               const data = Object.fromEntries(formData.entries());

               const response = await state.login(data);

               if (response.id) {
                  Router.go("/start");
               } else {
                  let errorMessageEl =
                     formEl.shadowRoot.querySelector(".error-message");
                  if (errorMessageEl) {
                     formEl.shadowRoot.removeChild(errorMessageEl);
                  }
                  errorMessageEl = document.createElement("span");
                  errorMessageEl.classList.add("error-message");
                  errorMessageEl.innerHTML = `Asegurate de haber completado todos los campos<br>${response.message}`;
                  formEl.shadowRoot.appendChild(errorMessageEl);
               }
            }
         );

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
               form-comp{
                  width: 100%
               }
            move-selector-comp{
               width: 100%
            }
         }
         `;

         container.append(title, formEl, moveSelector);
         this.append(container, style);
      }
   }
   customElements.define("login-page", LoginPage);
}
export { initLogin };
