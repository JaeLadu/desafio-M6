import { Router } from "@vaadin/router";
import { state } from "../../state";

function initMountPlayPage() {
   class MountPlayPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const counterEl = document.createElement("counter-comp");
         counterEl.addEventListener("timeUp", (e) => {
            Router.go("/result");
         });

         const moveSelectorContainerEl = document.createElement("div");
         moveSelectorContainerEl.classList.add("container");

         const moveSelectorEl = document.createElement("move-selector-comp");
         moveSelectorEl.setAttribute("big", "yes");
         moveSelectorEl.shadowRoot?.addEventListener(
            "selected",
            (e: CustomEventInit) => {
               state.updateCurrentPlay("", e.detail);
            }
         );

         const style = document.createElement("style");
         style.textContent = `
         mount-play-page{
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap:25vh;
         }
         @media screen and (min-width: 440px){
            mount-play-page{
               gap: 15vh;
            }
            .container{
               width:65vw;
            }

         `;

         moveSelectorContainerEl.append(moveSelectorEl);
         this.append(counterEl, moveSelectorContainerEl, style);
      }
   }

   customElements.define("mount-play-page", MountPlayPage);
}
export { initMountPlayPage };
