import { initButton } from "./components/button";
import { initCounter } from "./components/counter";
import { initForm } from "./components/form";
import { initHeader } from "./components/header";
import { initMoveSelector } from "./components/move-selector";
import { initText } from "./components/text";
import { initTitle } from "./components/title";
import { initAccessRoomPage } from "./pages/ access-room";
import { initMountPlayPage } from "./pages/counter";
import { initLogin } from "./pages/login";
import { initPlayPage } from "./pages/play";
import { initRoomError } from "./pages/room-error";
import { initShareCodePage } from "./pages/share-code";
import { initStart } from "./pages/start";
import { initWaitPlayPage } from "./pages/wait-play";
import { initRouter } from "./router";

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
   initRoomError();
   initWaitPlayPage();
   initMountPlayPage();
   const root =
      document.querySelector(".root") || document.createElement("div");

   initRouter(root);
})();
