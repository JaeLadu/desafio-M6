function initForm() {
   class Form extends HTMLElement {
      constructor() {
         super();
      }
      shadow = this.attachShadow({ mode: "open" });
      connectedCallback() {
         const formEl = document.createElement("form");

         formEl.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(formEl);
            const customEvent = new CustomEvent("customSubmit", {
               bubbles: true,
               detail: formData,
            });

            formEl.dispatchEvent(customEvent);
         });

         const fields = this.getAttribute("fields").split(",");

         fields.forEach((field, index) => {
            const labelEl = document.createElement("label");
            const titleEl = document.createElement("span");
            const inputEl = document.createElement("input");

            titleEl.textContent = field;
            inputEl.type = "text";
            inputEl.name = field;
            if (index == 0) {
               inputEl.autofocus = true;
            }

            labelEl.append(titleEl, inputEl);
            formEl.append(labelEl);
         });

         const buttonEl = document.createElement("button");
         buttonEl.textContent = this.getAttribute("button");

         const style = document.createElement("style");
         style.textContent = `
         label{
            display: block;
            margin-bottom: 20px;
         }
         span{
            display:block;
            font-family: 'Odibee Sans';
            font-size: 45px;
         }
         input{
            font-family: 'Odibee Sans';
            font-size: 35px;
            border: 10px solid #182460;
            border-radius: 10px;
            max-height: 85px;
            padding: 17px;
            box-sizing:border-box;
            width: 100%;
         }
         button{
               background-color: #006CFC;
               border: 10px solid #001997;
               border-radius: 10px;
               width: 100%;
               max-height: 85px;
               padding: 17px;
               display: flex;
               justify-content: center;
               align-items: center;
               font-family: 'Odibee Sans', cursive;
               font-size: 45px;
               color: #D8FCFC;
         }
         `;

         formEl.append(buttonEl);
         this.shadow.append(formEl, style);
      }
   }

   customElements.define("form-comp", Form);
}
export { initForm };
