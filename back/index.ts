import express, { json } from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import {
   firebaseDatabase as firebaseDB,
   firestoreDatabase as firestoreDB,
} from "./database";

const app = express();
const PORT = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT;
const ROOT_PATH = __dirname.replace("back", "");

app.use(json());
app.use(cors());

app.get("/up", (req, res) => {
   return res.send(`server up and running on ${environment} mode`);
});

app.post("/signup", async (req, res) => {
   const { name, mail } = req.body;

   if (!name || !mail) {
      return res.status(400).json({ message: "Information missing" });
   }

   //habla con la DB, crea el usuario y devuelve el ID
   const firestoreId = await firestoreDB.collection("/users").add(req.body);

   return res.json({ id: firestoreId.id, name, mail });
});

app.post("/signin", async (req, res) => {
   const { mail } = req.body;

   if (!mail) {
      return res.status(400).json({ message: "Information missing" });
   }

   //habla con la DB, chequea que el usuario exista y devuelve el ID
   let user;
   const snap = await firestoreDB.collection("/users").get();
   snap.forEach((doc) => {
      if (doc.data().mail == mail) {
         user = { ...doc.data(), id: doc.id };
      }
   });

   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   return res.json(user);
});

app.get("/users/:userId", async (req, res) => {
   const { userId } = req.params;

   const snap = await firestoreDB.collection("users").doc(`${userId}`).get();
   const user = snap.data();

   if (!snap.exists) {
      return res.status(404).json({ message: "User not found" });
   }
   return res.json(user);
});

app.post("/room", async (req, res) => {
   const { name, mail, id } = req.body;

   if (!name || !mail || !id) {
      return res.status(400).send("Information missing");
   }

   //crea room en firebase
   const shortId = nanoid(4);
   const fireBaseRoom = {
      users: [
         {
            id,
            name,
            mail,
            owner: true,
         },
      ],
      shortId,
   };

   const firebaseId = await firebaseDB.ref("/rooms").push({ ...fireBaseRoom })
      .key;

   //crea room en firestore y guarda todo
   const firestoreRoom = { ...fireBaseRoom, firebaseId };
   const firestoreId = (
      await firestoreDB.collection("rooms").add(firestoreRoom)
   ).id;

   const responseRoom = { ...firestoreRoom, firestoreId };

   return res.json(responseRoom);
});

app.get("/rooms/:roomId", async (req, res) => {
   const { roomId } = req.params;
   const { name, mail, id } = req.query;

   if (!mail || !name || !id) {
      return res.status(400).send("Information missing");
   }

   //busca el room usando el id corto en firestore
   let firestoreRoom;
   const snap = await firestoreDB.collection("rooms").get();
   snap.forEach((room) => {
      if (room.data().shortId == roomId) {
         firestoreRoom = { ...room.data(), id: room.id };
      }
   });

   if (!firestoreRoom) {
      return res.status(404).json({ message: "Room not found" });
   }

   //chequea en fs que el room no tenga 2 users
   // si los tiene, chequea que el que quiere ingresar sea uno de esos
   if (firestoreRoom && firestoreRoom.users.length == 2) {
      const userAllowedInRoom = firestoreRoom.users.filter(
         (user) => user.id == id
      );

      //si no es ninguno de los dos devuelve error
      if (!userAllowedInRoom.length) {
         return res.status(403).json("User not part of the room");
      }

      return res.send(firestoreRoom.firebaseId);
   }

   //si la room no tiene 2 usuarios, agrega este a la room en ambas bases de datos y devuelve el firebase ID
   if (firestoreRoom && firestoreRoom.users.length < 2) {
      firestoreRoom.users.push({ name, mail, id });

      firestoreDB
         .collection("rooms")
         .doc(firestoreRoom.id)
         .update({ users: firestoreRoom.users });

      firebaseDB
         .ref(`rooms/${firestoreRoom.firebaseId}`)
         .update({ users: firestoreRoom.users });

      return res.send(firestoreRoom.firebaseId);
   }
});

app.use("*", express.static(`${ROOT_PATH}/dist`));

app.listen(PORT, () => console.log(`app escuchando en el puerto ${PORT}`));
