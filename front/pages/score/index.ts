import { state } from "../../state";

const greenStarEl = require("../../elements/ganaste.svg");
const redStarEl = require("../../elements/perdiste.svg");
const blueStarEl = require("../../elements/empateAzul.svg");

function initScorePage() {
   class ScorePage extends HTMLElement {
      constructor() {
         super();
         state.subscribe(() => this.connectedCallback);
      }

      onBeforeEnter() {
         const { databaseConnection } = state.getState();
         if (!databaseConnection) {
            state.updateRoomData();
         }
      }

      async connectedCallback() {
         await state.setWinner();
         const currentState = state.getState();
         const winner = currentState.room.currentPlay.winner;
         const container = document.createElement("div");
         container.classList.add("result-container");

         const starEl = document.createElement("img");
         starEl.classList.add("star");
         if (winner == "tie") {
            starEl.src = blueStarEl;
         } else if (winner == currentState.user.id) {
            starEl.src = greenStarEl;
         } else {
            starEl.src = redStarEl;
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
         const scoreTitleEl = document.createElement("text-comp");
         scoreTitleEl.classList.add("score__title");
         scoreTitleEl.textContent = "SCORE";
         scoreTitleEl.setAttribute("size", "55px");
         const scoreContainerEl = document.createElement("div");
         scoreContainerEl.classList.add("score__container");
         currentState.room.users.forEach((user) => {
            const spanEl = document.createElement("text-comp");
            spanEl.textContent = `${user.name}: ${user.score}`;
            spanEl.setAttribute("size", "45px");
            scoreContainerEl.append(spanEl);
         });
         scoreEl.append(scoreTitleEl, scoreContainerEl);

         const playAgainButtonEl = document.createElement("button-comp");
         playAgainButtonEl.setAttribute("text", "Volver a jugar");
         playAgainButtonEl.setAttribute("target", "/play");
         playAgainButtonEl.addEventListener("click", (e) =>
            state.changeUserStatus({ start: false, connected: true })
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
                    : winner == "tie"
                    ? "rgba(0, 108, 150, 1)"
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
          @media screen and (min-width: 440px){
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
         container.append(starEl, scoreEl, playAgainButtonEl, exitButtonEl);
         this.append(container, style);
      }
   }
   customElements.define("score-page", ScorePage);
}
export { initScorePage };
