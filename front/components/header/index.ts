import { state } from "../../state";

function initHeader() {
   class Header extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const shadow = this.attachShadow({ mode: "open" });
         const currentState = state.getState();
         const headerEl = document.createElement("header");
         const scoreEl = document.createElement("div");
         const roomCodeEl = document.createElement("div");
         const style = document.createElement("style");

         currentState.room.users?.forEach((user, index) => {
            const spanEl = document.createElement("span");
            const score = currentState.room.score
               ? currentState.room.score[user]
               : 0;
            spanEl.textContent = `${user.name}: ${score}`;
            if (index === 0) {
               spanEl.classList.add("owner");
            }
            scoreEl.append(spanEl);
         });

         roomCodeEl.innerHTML = `
            <span>Sala</span>
         <span>${currentState.room.shortId}</span>
         
         `;

         style.textContent = `
         header{
            width:95vw;
            display:flex;
            justify-content: space-between;
        }
        div{
            display:flex;
            flex-direction: column;
         }
         .owner{
            color:red;
         }
         `;

         headerEl.append(scoreEl, roomCodeEl);
         shadow.append(headerEl, style);
      }
   }

   customElements.define("header-comp", Header);
}

export { initHeader };
