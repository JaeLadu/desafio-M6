function initStrongText() {
   class StrongText extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });
      connectedCallback() {
         if (this.isConnected) {
            const div = document.createElement("div");
            const content = document.createElement("p");
            const style = document.createElement("style");
            let color = "black";
            if (this.hasAttribute("color")) {
               color = this.getAttribute("color");
            }
            let size = "35px";
            if (this.hasAttribute("size")) {
               size = this.getAttribute("size");
            }

            content.innerHTML = this.textContent || "Un texto";

            style.textContent = `
                 p{
                 color: ${color};
                 margin: 0;
                 text-align: center;
                 font-family: 'Roboto Slab';
                 font-style: normal;
                 font-weight: 700;
                 font-size: ${size};
                }
                 `;
            div.append(content);
            this.shadow.append(div, style);
         }
      }
   }

   customElements.define("strong-text-comp", StrongText);
}
export { initStrongText };
