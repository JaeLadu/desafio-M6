function mountWelcome(root) {
   const title = document.createElement("title-comp");
   title.textContent = "Piedra, Papel <span class='ligth'>ó</span> Tijera";

   const newGameButton = document.createElement("button-comp");
   newGameButton.setAttribute("text", "Nuevo Juego");
   newGameButton.setAttribute("target", "/instructions");

   const moveSelector = document.createElement("move-selector-comp");

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
      gap: 11vh;
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

   container.append(title, button, moveSelector);
   root.innerHTML = "";
   root.append(container, style);
}
export { mountWelcome };
