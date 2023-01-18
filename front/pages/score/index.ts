import { state } from "../../state";

const greenStar = require("../../elements/ganaste.svg");
const redStar = require("../../elements/perdiste.svg");

function mountScore(root) {
   const result = state.getCurrentGame().result;

   const totalScore = state.getScore();

   const container = document.createElement("div");
   container.classList.add("result-container");

   const star = document.createElement("img");
   star.classList.add("star");
   if (result == "win") {
      star.src = greenStar;
   } else {
      star.src = redStar;
   }

   const score = document.createElement("div");
   score.classList.add("score");
   score.innerHTML = `
   <h5 class="score__title">Score</h5>
   <div class="score__container">
      <span>Vos: ${totalScore.player}</span>
      <span>Maquina: ${totalScore.computer}</span>
   </div>

   `;

   const button = document.createElement("button-comp");
   button.setAttribute("text", "Volver a jugar");
   button.setAttribute("target", "/play");

   const style = document.createElement("style");
   style.textContent = `
    .result-container{
        background-color: ${
           result == "win"
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

   container.append(star, score, button);
   root.append(container, style);
}
export { mountScore };
