function initText() {
   class Text extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });
      connectedCallback() {
         if (this.isConnected) {
            const div = document.createElement("div");
            const content = document.createElement("p");
            const style = document.createElement("style");

            content.innerHTML = this.textContent || "Un texto";

            style.textContent = `
                 p{
                 color: black;
                 margin: 0;
                 text-align: center;
                 font-family: 'Odibee Sans';
                 font-style: normal;
                 font-weight: 600;
                 font-size: 35px;
                }
                 `;
            div.append(content);
            this.shadow.append(div, style);
         }
      }
   }

   customElements.define("text-comp", Text);
}
export { initText };
