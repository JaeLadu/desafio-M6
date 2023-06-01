import { initButton } from "./components/button";
import { initCounter } from "./components/counter";
import { initForm } from "./components/form";
import { initHeader } from "./components/header";
import { initMoveSelector } from "./components/move-selector";
import { initSecondaryText } from "./components/secondary-text";
import { initStrongText } from "./components/strong-text";
import { initText } from "./components/text";
import { initTitle } from "./components/title";
import { initAccessRoomPage } from "./pages/ access-room";
import { initMountPlayPage } from "./pages/counter";
import { initLogin } from "./pages/login";
import { initPlayPage } from "./pages/play";
import { initResultPage } from "./pages/result";
import { initRoomError } from "./pages/room-error";
import { initScorePage } from "./pages/score";
import { initShareCodePage } from "./pages/share-code";
import { initStart } from "./pages/start";
import { initWaitPlayPage } from "./pages/wait-play";
import { initRouter } from "./router";
import { state } from "./state";

(() => {
   initTitle();
   initButton();
   initMoveSelector();
   initText();
   initSecondaryText();
   initStrongText();
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
   initResultPage();
   initScorePage();
   const root =
      document.querySelector(".root") || document.createElement("div");

   initRouter(root);

   window.addEventListener("beforeunload", () => {
      console.log("unload");
      state.changeUserStatus({ connected: false, start: false });
      const currentState = state.getState();
      currentState.databaseConnection = false;
      state.setState(currentState);
   });
})();
