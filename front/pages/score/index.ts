import { state } from "../../state";

const greenStar = require("../../elements/ganaste.svg");
const redStar = require("../../elements/perdiste.svg");

function initScorePage() {
   class ScorePage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(() => this.connectedCallback);
      }

      async connectedCallback() {
         await state.setWinner();
         const currentState = state.getState();
         const winner = currentState.room.currentPlay.winner;

         const container = document.createElement("div");
         container.classList.add("result-container");
         const star = document.createElement("img");
         star.classList.add("star");
         if (winner == currentState.user.id) {
            star.src = greenStar;
         } else {
            star.src = redStar;
         }

         let owner;
         if (currentState.user.owner) {
            owner = currentState.user.id;
         } else {
            owner = currentState.room.users.find(
               (u) => u.id !== currentState.user.id
            ).id;
         }
         const scoreEl = document.createElement("div");
         scoreEl.classList.add("score");
         const scoreTitleEl = document.createElement("div");
         scoreTitleEl.classList.add("score__title");
         scoreTitleEl.textContent = "SCORE";
         const scoreContainerEl = document.createElement("div");
         scoreContainerEl.classList.add("score__container");
         currentState.room.users.forEach((user) => {
            const spanEl = document.createElement("span");
            spanEl.textContent = `${user.name}: ${user.score}`;
            scoreContainerEl.append(spanEl);
         });
         scoreEl.append(scoreTitleEl, scoreContainerEl);

         const playAgainButtonEl = document.createElement("button-comp");
         playAgainButtonEl.setAttribute("text", "Volver a jugar");
         playAgainButtonEl.setAttribute("target", "/play");
         playAgainButtonEl.addEventListener("click", (e) =>
            state.changeUserStatus({ start: false })
         );

         const exitButtonEl = document.createElement("button-comp");
         exitButtonEl.setAttribute("text", "Salir");
         exitButtonEl.setAttribute("target", "/start");

         const style = document.createElement("style");
         style.textContent = `
          .result-container{
              background-color: ${
                 winner == currentState.user.id
                    ? "rgba(136, 137, 73, 0.9)"
                    : "rgba(137, 73, 73, 0.9)"
              };
                  position: absolute;
                  top:0;
                  bottom:0;
                  left:0;
                  right:0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-between;
                  padding: 35px 20px;
              }
              .star{
                  width: 69vw;
              }
          .score{
              width:69vw;
              min-height: 220px;
              background-color: white;
              border: solid black 10px;
              border-radius: 10px;
              font-family: 'Odibee Sans';
              font-size: 55px;
              padding: 15px 30px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
          }
          .score__title{
              margin: 0;
              text-align: center;
          }
          .score__container{
              text-align: end;
              font-size: 45px;
          }
          @media screen and (min-width: 400px){
              .star{
                  max-width: 20vw;
              }
              .score{
                  max-width:20vw;
              }
              .score__container > span{
                  display:block;
              }
              button-comp{
                  width:20vw;
              }
          }
          `;
         container.append(star, scoreEl, playAgainButtonEl, exitButtonEl);
         this.append(container, style);
      }
   }
   customElements.define("score-page", ScorePage);
}
export { initScorePage };
