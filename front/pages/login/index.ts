import { Router } from "@vaadin/router";
import { state } from "../../state";

function initLogin() {
   class LoginPage extends HTMLElement {
      constructor() {
         super();
      }
      connectedCallback() {
         const title = document.createElement("title-comp");
         title.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const formEl = document.createElement("form-comp");
         formEl.setAttribute("fields", "Tu nombre,Tu mail");
         formEl.setAttribute("button", "Ingresar");
         formEl.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(formEl.querySelector("form"));
            formData.append("name", formData.get("Tu nombre"));
            formData.append("mail", formData.get("Tu mail"));
            const data = Object.fromEntries(formData.entries());

            const response = await state.login(data);

            if (response.id) {
               Router.go("/start");
            } else {
               console.log(response.messege);
            }
         });

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

         container.append(title, formEl, moveSelector);
         this.append(container, style);
      }
   }
   customElements.define("login-page", LoginPage);
}
export { initLogin };
