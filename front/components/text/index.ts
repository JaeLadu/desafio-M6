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
            let color = "black";
            if (this.hasAttribute("color")) {
               color = this.getAttribute("color");
            }
            let size = "35px";
            if (this.hasAttribute("size")) {
               size = this.getAttribute("size");
            }

            const style = document.createElement("style");

            content.innerHTML = this.textContent || "Un texto";

            style.textContent = `
                 p{
                 color: ${color};
                 margin: 0;
                 text-align: center;
                 font-family: 'Odibee Sans';
                 font-style: normal;
                 font-weight: 600;
                 font-size: ${size};
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
