function initForm() {
   class Form extends HTMLElement {
      constructor() {
         super();
      }
      connectedCallback() {
         const formEl = document.createElement("form");
         const fields = this.getAttribute("fields").split(",");

         fields.forEach((f) => {
            const labelEl = document.createElement("label");
            const titleEl = document.createElement("span");
            const inputEl = document.createElement("input");

            titleEl.textContent = f;
            inputEl.type = "text";
            inputEl.name = f;

            labelEl.append(titleEl, inputEl);
            formEl.append(labelEl);
         });

         const buttonEl = document.createElement("button");
         buttonEl.textContent = this.getAttribute("button");

         const style = document.createElement("style");
         style.textContent = `
         label, span{
            display: block;
         }
         `;

         formEl.append(buttonEl);
         this.append(formEl, style);
      }
   }

   customElements.define("form-comp", Form);
}
export { initForm };