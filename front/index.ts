import { initButton } from "./components/button";
import { initCounter } from "./components/counter";
import { initForm } from "./components/form";
import { initHeader } from "./components/header";
import { initMoveSelector } from "./components/move-selector";
import { initText } from "./components/text";
import { initTitle } from "./components/title";
import { initAccessRoomPage } from "./pages/ access-room";
import { initLogin } from "./pages/login";
import { initPlayPage } from "./pages/play";
import { initShareCodePage } from "./pages/share-code";
import { initStart } from "./pages/start";
import { initRouter } from "./router";
import { state } from "./state";

(() => {
   initTitle();
   initButton();
   initMoveSelector();
   initText();
   initCounter();
   initForm();
   initHeader();
   initLogin();
   initStart();
   initShareCodePage();
   initAccessRoomPage();
   initPlayPage();

   const root =
      document.querySelector(".root") || document.createElement("div");

   initRouter(root);
})();
