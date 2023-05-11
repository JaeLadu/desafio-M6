import { Router } from "@vaadin/router";
import { state } from "../../state";

function initMountPlayPage() {
   class MountPlayPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const counter = document.createElement("counter-comp");
         counter.addEventListener("timeUp", (e) => {
            Router.go("/result");
         });

         const moveSelector = document.createElement("move-selector-comp");
         moveSelector.setAttribute("big", "yes");
         moveSelector.shadowRoot?.addEventListener(
            "selected",
            (e: CustomEventInit) => {
               state.updateCurrentPlay("", e.detail);
            }
         );

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
         }
         `;
         container.append(counter, moveSelector);
         this.append(container, style);
      }
   }

   customElements.define("mount-play-page", MountPlayPage);
}
export { initMountPlayPage };
