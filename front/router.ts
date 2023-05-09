import { Router } from "@vaadin/router";

function initRouter(root: Element) {
   const router = new Router(root);

   router.setRoutes([
      {
         path: "/",
         component: "login-page",
      },
      {
         path: "/start",
         component: "start-page",
      },
      {
         path: "/share",
         component: "share-code-page",
      },
      {
         path: "/accesroom",
         component: "access-room-page",
      },
      {
         path: "/play",
         component: "play-page",
      },
      {
         path: "/roomerror",
         component: "room-error-page",
      },
   ]);
}

export { initRouter };
