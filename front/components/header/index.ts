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
         let owner;
         if (currentState.user.owner) {
            owner = currentState.user.id;
         } else {
            owner = currentState.room.users.find(
               (u) => u.id !== currentState.user.id
            ).id;
         }

         currentState.room.users.forEach((user) => {
            const spanEl = document.createElement("span");
            spanEl.textContent = `${user.name}: ${user.score || 0}`;
            if (user.id == owner) {
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
