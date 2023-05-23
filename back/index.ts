import express, { json } from "express";
import cors from "cors";
import { customAlphabet } from "nanoid";
import {
   firebaseDatabase as firebaseDB,
   firestoreDatabase as firestoreDB,
} from "./database";

const nanoid = customAlphabet("123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4); //configura que caracteres y que cantidad debe generar nano cuando se lo llame
const app = express();
const PORT = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT;
const ROOT_PATH = __dirname.replace("back", "");

app.use(json());
app.use(cors());

//método para comprobar que el server esté activo, sólo devuelve un mensaje que aclara en que ambiente está corriendo (local, producción, etc)
app.get("/up", (req, res) => {
   return res.send(`server up and running on ${environment} mode`);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para registrar usuarios nuevos en firestore
app.post("/signup", async (req, res) => {
   const { name, mail } = req.body;

   if (!name || !mail) {
      return res.status(400).json({ message: "Information missing" });
   }

   //habla con la DB, crea el usuario y devuelve el ID
   const firestoreId = await firestoreDB.collection("/users").add(req.body);

   return res.json({ id: firestoreId.id, name, mail });
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para validar usuarios en la base de datos
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

   //si el usuario no se encuentra, devuelve el error con un mensaje
   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   return res.json(user);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para recuperar toda la info de un user
app.get("/users/:userId", async (req, res) => {
   const { userId } = req.params;

   const snap = await firestoreDB.collection("users").doc(`${userId}`).get();
   const user = snap.data();

   //chequea que el user exista en la DB, sino devuelve error con mensaje
   if (!snap.exists) {
      return res.status(404).json({ message: "User not found" });
   }
   return res.json(user);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para crear a una room en ambas bases de datos
app.post("/room", async (req, res) => {
   const { name, mail, id } = req.body;

   //chequea que toda la info necesaria haya sido recibida, sino devuelve error con mensaje
   if (!name || !mail || !id) {
      return res.status(400).send("Information missing");
   }

   //crea room en firebase
   const shortId = nanoid();
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

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para acceder a una room ya existente
app.get("/rooms/:roomId", async (req, res) => {
   const { roomId } = req.params;
   const { name, mail, id } = req.query;

   //chequea que toda la info necesaria haya sido recibida, sino devuelve error con mensaje
   if (!mail || !name || !id) {
      return res
         .status(400)
         .json({ message: ["Falta información", "Information missing"] });
   }

   //busca el room usando el id corto en firestore
   let firestoreRoom;
   const snap = await firestoreDB.collection("rooms").get();
   snap.forEach((room) => {
      if (room.data().shortId == roomId) {
         firestoreRoom = { ...room.data(), id: room.id };
      }
   });

   //si no encuentra la room, devuelve error con mensaje
   if (!firestoreRoom) {
      return res
         .status(404)
         .json({ message: ["Esa sala no existe", "Room not found"] });
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

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para editar datos de usuario en la base de datos (principalmente usado para modificar estados de online y start)
app.patch("/rooms/:roomId", async (req, res) => {
   const { roomId } = req.params;
   const { id, status } = req.body;
   const roomRef = firebaseDB.ref(`rooms/${roomId}/users`);
   const roomUsers: [any] = await (await roomRef.get()).val();
   const user = roomUsers.find((user) => user.id == id);
   const userIndex = roomUsers.indexOf(user);

   //usando el index, saca el elemento que corresponde al usuario del array
   if (userIndex == 0) {
      roomUsers.shift();
   }
   if (userIndex == 1) {
      roomUsers.pop();
   }
   //después agrega/modifica los datos necesarios, vuelve a agregar al usuario modificado al array y envía la info nuevamente a la DB
   const newUser = { ...user, ...status };
   roomUsers.push(newUser);
   const transaction = await roomRef.transaction(() => roomUsers);

   return res.send(transaction.snapshot);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método para crear una nueva juagada dentro de la lista de jugadas de la room que se pasa como parámetro y setearla como la jugada en curso
app.post("/:roomId/play", async (req, res) => {
   const { roomId } = req.params;
   const roomRef = firebaseDB.ref(`rooms/${roomId}`);
   const users = req.body;

   //crea el esqueleto de la currentPlay, con info mínima
   const currentPlay = {
      [users[0].id]: {
         name: users[0].name,
      },
      [users[1].id]: {
         name: users[1].name,
      },
      winner: "",
   };

   //agrega la jugada a la lista de jugadas de la room en firebase y guarda la key de dicha jugada en una variable
   const playKey = await firebaseDB
      .ref(`rooms/${roomId}/playsList`)
      .push(currentPlay).key;

   //modifica el campo de la jugada actual con los datos que acaba de crear más el id
   await roomRef.update({
      currentPlay: { ...currentPlay, id: playKey },
   });

   res.status(200).send(playKey);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//método que recibe información sobre las jugadas, tanto la selección de cualquiera de los jugadores (piedra, papel o tijera), cómo quien es el ganador
//y usa esta info para actualizar firebase
app.patch("/:roomId/:playId", async (req, res) => {
   const { roomId, playId } = req.params;
   const { move, player, winner } = req.body;
   const roomRef = firebaseDB.ref(`rooms/${roomId}`);
   const currentPlay = (await roomRef.child("currentPlay").get()).val();
   let users = (await roomRef.child("users").get()).val();

   if (winner) {
      currentPlay.winner = winner;
      if (winner != "tie") {
         //antes de actualizar el score se asegura de que ambos usuarios tengan una key "score"
         const scoreMissing = users.find((u) => !("score" in u));
         if (scoreMissing) {
            users = users.map((u) => ({ ...u, score: 0 }));
         }
         //busca el index del usuario que ganó
         const winnerIndex = users.findIndex((u) => u.id == winner);

         //actualiza el score del winner
         users[winnerIndex].score++;
         await roomRef.child("users").transaction(() => users);
      }
   }
   if (move) {
      currentPlay[player].move = move;
   }

   //actualiza la jugada actual
   const currentPlayTransaction = await roomRef
      .child("currentPlay")
      .transaction(() => currentPlay);

   //actualiza la jugada dentro de la lista de jugadas
   await roomRef
      .child("playsList")
      .child(currentPlay.id)
      .transaction(() => currentPlay);

   return res.send(currentPlayTransaction.snapshot);
});

app.use("*", express.static(`${ROOT_PATH}/dist`));

app.listen(PORT, () => console.log(`app escuchando en el puerto ${PORT}`));
