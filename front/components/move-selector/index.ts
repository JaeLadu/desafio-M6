const piedraImg = require("../../elements/piedra.svg");
const papelImg = require("../../elements/papel.svg");
const tijeraImg = require("../../elements/tijera.svg");

function initMoveSelector() {
   class MoveSelector extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });

      connectedCallback() {
         if (this.isConnected) {
            const container = document.createElement("div");
            container.classList.add("container");
            if (this.getAttribute("big") == "yes") {
               container.classList.add("big");
            }
            container.addEventListener("selected", (e: CustomEventInit) => {
               const plays = container.querySelectorAll(`.play`);
               plays.forEach((p) => {
                  p.classList.remove("unselected");
                  if (p.getAttribute("play") !== e.detail) {
                     p.classList.add("unselected");
                  }
               });
            });

            const piedraSelected = new CustomEvent("selected", {
               bubbles: true,
               detail: "piedra",
            });
            const papelSelected = new CustomEvent("selected", {
               bubbles: true,
               detail: "papel",
            });
            const tijeraSelected = new CustomEvent("selected", {
               bubbles: true,
               detail: "tijera",
            });

            const piedra = document.createElement("img");
            piedra.classList.add("play");
            piedra.setAttribute("src", piedraImg);
            piedra.setAttribute("play", "piedra");
            piedra.addEventListener("click", () => {
               piedra.dispatchEvent(piedraSelected);
            });

            const papel = document.createElement("img");
            papel.classList.add("play");
            papel.setAttribute("src", papelImg);
            papel.setAttribute("play", "papel");
            papel.addEventListener("click", () => {
               papel.dispatchEvent(papelSelected);
            });

            const tijera = document.createElement("img");
            tijera.classList.add("play");
            tijera.setAttribute("src", tijeraImg);
            tijera.setAttribute("play", "tijera");
            tijera.addEventListener("click", () => {
               tijera.dispatchEvent(tijeraSelected);
            });

            const style = document.createElement("style");
            style.textContent = `
            .container{
                display: flex;
                align-items:flex-end;
                gap: 20px;
                height:100%
            }
            .big{
               height: 64vw;
            }
            .play{
               height:100%;
            }
            .unselected{
               opacity: 0.5;
            }
            @media screen and (min-width: 400px){
               .container{
                  justify-content: space-between;
               }
            }
            `;

            container.append(piedra, papel, tijera);
            this.shadow.append(container, style);
         }
      }
   }
   customElements.define("move-selector-comp", MoveSelector);
}
export { initMoveSelector };
