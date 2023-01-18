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
   ]);
}

export { initRouter };
