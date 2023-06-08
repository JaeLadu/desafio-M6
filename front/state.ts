import { onValue, ref } from "firebase/database";
import { firebaseDB } from "./database";

const HOST = process.env.HOST || "http://localhost:3000";
const state = {
   data: {
      user: {},
      room: {},
      databaseConnection: false,
   },
   subscribed: [],

   updateRoomData() {
      const currentState = this.getState();
      const { firebaseId } = currentState.room;
      if (firebaseId) {
         onValue(ref(firebaseDB, `rooms/${firebaseId}`), (snap) => {
            const data = snap.val();
            const newState = currentState;
            newState.room = { ...currentState.room, ...data };
            this.setState(newState);
            this.subscribed.forEach((f) => {
               f();
            });
         });
         this.data.databaseConnection = true;
      }
   },

   getState() {
      if (!this.data.user.id) {
         this.checkLocalStorage();
      }
      return this.data;
   },

   setState(newState) {
      this.data = { ...this.data, ...newState };
      this.saveToLocalStorage();
   },

   subscribe(subscriberFunction) {
      const alreadySubscribed = this.subscribed.find(subscriberFunction);
      if (!alreadySubscribed) {
         this.subscribed.push(subscriberFunction);
      }
   },

   checkLocalStorage() {
      const localData = localStorage.getItem("multiplayerRockPaperScissors");
      if (localData) {
         const localObject = JSON.parse(localData);
         this.data = { ...localObject };
      }
   },

   saveToLocalStorage() {
      localStorage.setItem(
         "multiplayerRockPaperScissors",
         JSON.stringify(this.data)
      );
   },

   clearLocalStorage() {
      this.data = {
         user: {},
         room: {},
      };
      this.saveToLocalStorage();
   },

   async signup(userData) {
      //intenta crear un usuario con los datos
      const response = await fetch(`${HOST}/signup`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(userData),
      });

      const data = await response.json();

      //si la respuesta es 400 significa que faltan datos, devuelve un mensaje diciendo eso
      if (response.status == 400) {
         return data.message;
      }

      return data;
   },

   async login(userData) {
      //intenta logearse con los datos
      const response = await fetch(`${HOST}/signin`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(userData),
      });

      let data = await response.json();

      //si la respuesta es 400 significa que faltan datos, devuelve un mensaje diciendo eso
      if (response.status == 400) {
         return data;
      }
      //si la respuesta es 404 o a data le falta el id significa que el usuario no existe en la base de datos, así que lo crea
      if (!data.id || response.status == 404) {
         data = await this.signup(userData);
      }

      //vuelve a checkear por el id en caso de que signup falle
      if (data.id) {
         const state = this.getState();
         data.owner = false;
         state.user = data;
         this.setState(state);
      }
      return data;
   },

   async createNewRoom() {
      const oldState = this.getState();
      const response = await fetch(`${HOST}/room`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(oldState.user),
      });

      const data = await response.json();

      if (data.shortId) {
         const newState = { ...oldState, room: { ...data } };
         newState.user.owner = true;
         this.setState(newState);

         this.updateRoomData();
      }
   },

   async accessRoom(roomId) {
      const oldState = this.getState();
      const response = await fetch(
         `${HOST}/rooms/${roomId}?name=${oldState.user.name}&mail=${oldState.user.mail}&id=${oldState.user.id}`
      );
      const data = await response.json();

      if (response.status != 200) {
         const newState = oldState;
         newState.room = data;
         this.setState(newState);

         return { status: response.status, message: data };
      }

      if (data.shortId) {
         const newRoom = { ...oldState.room, ...data };
         const newState = oldState;
         newState.room = newRoom;
         if (data.owner == oldState.user.id) {
            newState.user.owner = true;
         }

         this.setState(newState);

         this.updateRoomData();

         return data;
      }
   },

   checkBothUsersOnline() {
      const currentState = this.getState();
      const users = currentState.room.users;
      const userMissing = users.find((user) => user.connected == false);

      if (!userMissing && users.length > 1) {
         return true;
      } else {
         return false;
      }
   },
   checkBothUsersStart() {
      const currentState = this.getState();
      const users = currentState.room.users;
      const userMissing = users.find((user) => user.start == false);

      if (!userMissing && users.length > 1) {
         return true;
      } else {
         return false;
      }
   },

   //cambia el estado del player a start:true y si el player es el owner de la room, llama al back para que cree la play
   async startUserPlay() {
      const currentState = this.getState();

      if (currentState.user.owner) {
         await fetch(`${HOST}/${currentState.room.firebaseId}/play`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(currentState.room.users),
         });
      }
   },

   async changeUserStatus(status: { connected: boolean; start: boolean }) {
      const currentState = this.getState();
      if (currentState.room.firebaseId) {
         const response = await fetch(
            `${HOST}/rooms/${currentState.room.firebaseId}`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ id: currentState.user.id, status }),
            }
         );
         return response;
      }
   },

   //informa al back el movimiento que el jugador hizo o el ganador para que actualice en la base de datos
   async updateCurrentPlay(
      winner: string,
      playerMove?: "piedra" | "papel" | "tijera"
   ) {
      const currentState = this.getState();
      const roomId = currentState.room.firebaseId;
      const playId = currentState.room.currentPlay.id;

      //checkea que datos se le pasaron a la función para mandar el body correcto al backend
      let body;
      if (playerMove) {
         body = {
            move: playerMove,
            player: currentState.user.id,
         };
      }
      if (winner) {
         body = { winner: winner };
      }

      await fetch(`${HOST}/${roomId}/${playId}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      });
      return;
   },

   async setWinner() {
      const currentState = this.getState();
      if (currentState.user.owner) {
         const resultsMap = {
            piedra: {
               piedra: "tie",
               papel: "lose",
               tijera: "win",
            },
            papel: {
               piedra: "win",
               papel: "tie",
               tijera: "lose",
            },
            tijera: {
               piedra: "lose",
               papel: "win",
               tijera: "tie",
            },
         };

         //define el id del user local y el del oponente
         const user = currentState.user.id;
         const opponent = currentState.room.users.find((u) => u.id !== user).id;
         //usa los ids para definir las jugadas que hizo cada uno, buscandolas en la partida actual
         const userMove = currentState.room.currentPlay[user].move;
         const opponentMove = currentState.room.currentPlay[opponent].move;
         //usa las jugadas de cada uno para definir si el user local es el ganador, perdedor, o si hay un empate en la partida actual
         let result;
         if (userMove && opponentMove) {
            result = resultsMap[userMove][opponentMove];
         }
         if (!userMove && opponentMove) {
            result = "lose";
         }
         if (!opponentMove && userMove) {
            result = "win";
         }
         if (!opponentMove && !userMove) {
            result = "tie";
         }

         let winner;

         //acualiza la base de datos con los datos del ganador
         if (result == "win") {
            winner = user;
         }
         if (result == "lose") {
            winner = opponent;
         }
         if (result == "tie") {
            winner = "tie";
         }

         await this.updateCurrentPlay(winner);
         return winner;
      }
      await this.updateCurrentPlay("");
      return;
   },
};

export { state };
