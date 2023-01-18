function initStart() {
   class StartPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const titleEl = document.createElement("title-comp");
         titleEl.textContent =
            "Piedra, Papel <span class='ligth'>ó</span> Tijera";

         const newRoomButtonEl = document.createElement("button-comp");
         const accesRoomButtonEl = document.createElement("button-comp");

         newRoomButtonEl.setAttribute("text", "Nuevo Juego");
         accesRoomButtonEl.setAttribute("text", "Ingresar a una sala");

         newRoomButtonEl.addEventListener("click", (e) => {});

         accesRoomButtonEl.setAttribute("target", "/accesroom");

         const moveSelectorEl = document.createElement("move-selector-comp");

         const containerEl = document.createElement("div");
         containerEl.classList.add("container");

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

         containerEl.append(
            titleEl,
            newRoomButtonEl,
            accesRoomButtonEl,
            moveSelectorEl
         );
         this.append(containerEl, style);
      }
   }
   customElements.define("start-page", StartPage);
}
export { initStart };