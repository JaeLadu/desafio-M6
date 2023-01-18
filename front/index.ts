import { initButton } from "./components/button";
import { initCounter } from "./components/counter";
import { initForm } from "./components/form";
import { initMoveSelector } from "./components/move-selector";
import { initSubtitle } from "./components/subtitle";
import { initTitle } from "./components/title";
import { initLogin } from "./pages/login";
import { initStart } from "./pages/start";
import { initRouter } from "./router";
import { state } from "./state";

(() => {
   state.checkLocalStorage();
   initTitle();
   initButton();
   initMoveSelector();
   initSubtitle();
   initCounter();
   initForm();
   initLogin();
   initStart();

   const root =
      document.querySelector(".root") || document.createElement("div");

   initRouter(root);
})();
