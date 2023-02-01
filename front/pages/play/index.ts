function initPlayPage() {
   class PlayPage extends HTMLElement {
      constructor() {
         super();
      }

      connectedCallback() {
         const headerEl = document.createElement("header-comp");

         this.append(headerEl);
      }
   }
   customElements.define("play-page", PlayPage);
}

export { initPlayPage };
