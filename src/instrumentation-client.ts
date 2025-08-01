import { initBotId } from "botid/client/core";
initBotId({
  protect: [
    {
      path: "/api/user",
      method: "POST",
    },
    {
      path: "/api/guild",
      method: "POST",
    },
  ],
});
