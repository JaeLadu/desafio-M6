import express, { json } from "express";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT;
const ROOT_PATH = __dirname.replace("back", "");

app.use(json());

app.get("/up", (req, res) => {
   res.send(`server up and running on ${environment} mode`);
});

app.post("/signup", (req, res) => {
   const { name, mail } = req.body;

   if (!name || !mail) {
      res.send("Information missing").status(400);
   }

   //habla con la DB, crea el usuario y devuelve el ID

   res.send({ userId: 1234 });
});

app.post("/signin", (req, res) => {
   const { mail } = req.body;
   const dbUser = { mail: "jaeladu1@gmail.com" };

   if (!mail) {
      res.send("Information missing").status(400);
   }

   //habla con la DB, chequea que el usuario exista y devuelve el ID
   if (dbUser.mail == mail) {
      res.send({ userId: 1234 });
   } else {
      res.send("User not found").status(404);
   }
});

app.get("/users/:userId", (req, res) => {
   const { userId } = req.params;

   res.send("All available user info");
});

app.post("/room", (req, res) => {
   const { name, mail } = req.body;

   if (!name || !mail) {
      res.send("Information missing").status(400);
   }

   const shortId = nanoid(4);
   //crea room en firebase
   const FBID = nanoid(10);
   //crea room en firestore y guarda todo

   const room = {
      user: {
         name,
         mail,
      },
      shortId,
      FBID,
   };

   res.send({ fsId: 7890, fbId: FBID }); //id de la room en firestore y en firebase
});

app.get("/rooms/:roomId", (req, res) => {
   const { roomId } = req.params;
   const { mail } = req.query;

   if (!mail) {
      res.send("mail missing").status(400);
   }

   //busca el room usando el id corto en firestore
   //primero debería chequear en fs que el room no tenga 2 users
   // si los tiene, chequea que el que quiere ingresar sea uno de esos
   //si no es ninguno de los dos devuelve error
   //si la room no tiene 2 usuarios, agrega este a la room en ambas bases de datos
   //y devuelve el fsId
   const fsId = 7890;
   //busca el fbId usando el fsId y lo devuelve
   const fbId = 4567;

   res.send({ fsId, fbId });
});

app.use("*", express.static(`${ROOT_PATH}/dist`));

app.listen(PORT, () => console.log(`app escuchando en el puerto ${PORT}`));
