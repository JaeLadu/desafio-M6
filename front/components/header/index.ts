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
            const textEl = document.createElement("secondary-text-comp");
            textEl.textContent = `${user.name}: ${user.score || 0}`;
            if (user.id == owner) {
               textEl.setAttribute("color", "red");
            }
            scoreEl.append(textEl);
         });

         roomCodeEl.innerHTML = `
            <strong-text-comp size= 24px>Sala</strong-text-comp>
         <secondary-text-comp size= 24px>${currentState.room.shortId}</secondary-text-comp>
         
         `;

         style.textContent = `
         header{
            margin-top: 15px;
            width:90vw;
            display:flex;
            justify-content: space-between;
        }
        div{
            display:flex;
            flex-direction: column;
         }
         `;

         headerEl.append(scoreEl, roomCodeEl);
         shadow.append(headerEl, style);
      }
   }

   customElements.define("header-comp", Header);
}

export { initHeader };
