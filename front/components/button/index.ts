import { Router } from "@vaadin/router";

function initButton() {
   class MainButton extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });
      connectedCallback() {
         if (this.isConnected) {
            const button = document.createElement("button");
            button.textContent = this.getAttribute("text") || "Empezar";
            if (this.hasAttribute("target")) {
               button.addEventListener("click", () => {
                  Router.go(this.getAttribute("target"));
               });
            }
            const style = document.createElement("style");
            style.textContent = `
            button{
               background-color: #006CFC;
               border: 10px solid #001997;
               border-radius: 10px;
               width: 100%;
               min-width: 85vw;
               max-height: 85px;
               padding: 17px;
               display: flex;
               justify-content: center;
               align-items: center;
               font-family: 'Odibee Sans', cursive;
               font-size: 45px;
               color: #D8FCFC;
            }
            @media screen and (min-width: 400px){
               button{
                  min-width:0;
               }
            }
            `;

            this.shadow.append(button, style);
         }
      }
   }
   customElements.define("button-comp", MainButton);
}
export { initButton };
