function initSubtitle() {
   class Subtitle extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });
      connectedCallback() {
         if (this.isConnected) {
            const div = document.createElement("div");
            const content = document.createElement("h2");
            const style = document.createElement("style");

            content.innerHTML = this.textContent || "Un subtitulo";

            style.textContent = `
                 h2{
                 color: black;
                 font-size:40px;
                 margin: 0;
                 text-align: center;
                }
                 `;
            div.append(content);
            this.shadow.append(div, style);
         }
      }
   }

   customElements.define("subtitle-comp", Subtitle);
}
export { initSubtitle };
