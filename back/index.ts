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
         },
      ],
      shortId,
      owner: id,
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

   //chequea si el usuario es parte de la room, saca el firebaseId y los users y trae la room de firebase
   const userInRoom = firestoreRoom.users.find((user) => user.id == id);
   let { firebaseId, users } = firestoreRoom;
   let firebaseRoom = {
      ...(await firebaseDB.ref(`rooms/${firebaseId}`).get()).val(),
      firebaseId,
   };
   let firebaseUsers = firebaseRoom.users;

   //si es parte de la room, devuelve el firebaseRoom
   if (userInRoom) {
      return res.json(firebaseRoom);
   }
   //si no es parte de la room y ya hay dos usuarios, devuelve un error, el usuario no es parte y no puede ingresar
   if (!userInRoom && users.length == 2) {
      return res.status(403).json("User not part of the room");
   }

   //si la room no tiene 2 usuarios, agrega este a la room en ambas bases de datos, vuelve a traer la firebaseRoom y la devuelve
   if (!userInRoom && users.length < 2) {
      users.push({ name, mail, id });
      firebaseUsers.push({ name, mail, id });

      firestoreDB.collection("rooms").doc(firestoreRoom.id).update({ users });

      firebaseDB.ref(`rooms/${firebaseId}`).update({ users: firebaseUsers });

      firebaseRoom.users = firebaseUsers;

      return res.json(firebaseRoom);
   }
});

app.patch("/rooms/:roomId", async (req, res) => {
   const { roomId } = req.params;
   const { id, status } = req.body;
   const roomRef = firebaseDB.ref(`rooms/${roomId}/users`);
   const roomUsers: [any] = await (await roomRef.get()).val();
   const user = roomUsers.find((user) => user.id == id);
   const userIndex = roomUsers.indexOf(user);

   if (userIndex == 0) {
      roomUsers.shift();
   }
   if (userIndex == 1) {
      roomUsers.pop();
   }
   const newUser = { ...user, ...status };
   roomUsers.push(newUser);
   const transaction = await roomRef.transaction(() => roomUsers);

   return res.send(transaction.snapshot);
});

//crea una nueva juagada dentro de la lista de jugadas de la room que se pasa como parámetro y la setea como la jugada en curso
app.post("/:roomId/play", async (req, res) => {
   const { roomId } = req.params;
   const roomRef = firebaseDB.ref(`rooms/${roomId}`);
   const users = req.body;

   const currentPlay = {
      [users[0].id]: {
         name: users[0].name,
      },
      [users[1].id]: {
         name: users[1].name,
      },
      winner: "",
   };

   const playKey = await firebaseDB
      .ref(`rooms/${roomId}/playsList`)
      .push(currentPlay).key;

   await roomRef.update({
      currentPlay: { ...currentPlay, id: playKey },
   });

   res.status(200).send(playKey);
});

app.patch("/:roomId/:playId", async (req, res) => {
   const { roomId, playId } = req.params;
   const { move, player, winner } = req.body;
   const roomRef = firebaseDB.ref(`rooms/${roomId}`);
   const currentPlay = (await roomRef.child("currentPlay").get()).val();

   if (winner) {
      currentPlay.winner = winner;
   }
   if (move) {
      currentPlay[player].move = move;
   }

   const transaction = await roomRef
      .child("currentPlay")
      .transaction(() => currentPlay);

   return res.send(transaction.snapshot);
});

app.use("*", express.static(`${ROOT_PATH}/dist`));

app.listen(PORT, () => console.log(`app escuchando en el puerto ${PORT}`));
