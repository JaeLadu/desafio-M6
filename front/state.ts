import { onValue, ref } from "firebase/database";
import { firebaseDB } from "./database";

const HOST = process.env.HOST || "http://localhost:3000";
const state = {
   data: {
      user: {},
      room: {},
   },
   subscribed: [],

   updateRoomData() {
      onValue(ref(firebaseDB, `rooms/${this.data.room.firebaseId}`), (snap) => {
         const data = snap.val();
         this.data.room = { ...this.data.room, ...data };
         this.subscribed.forEach((f) => {
            f();
         });
      });
   },

   getState() {
      if (!this.data.user.id) {
         this.checkLocalStorage();
      }
      return this.data;
   },

   setState(newState) {
      this.data = { ...newState };
      this.saveToLocalStorage();
   },

   subscribe(subscriberFunction) {
      this.subscribed.push(subscriberFunction);
   },

   checkLocalStorage() {
      const localData = localStorage.getItem("multiplayerRockPaperScissors");
      const localObject = JSON.parse(localData);
      if (localObject) {
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
         return data.message;
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
      const usersOnline = users.filter((user) => {
         return user.connected == true;
      });

      if (usersOnline.length > 1) {
         return true;
      } else {
         return false;
      }
   },
   checkBothUsersStart() {
      const currentState = this.getState();
      const users = currentState.room.users;
      const usersStart = users.filter((user) => {
         return user.start == true;
      });

      if (usersStart.length > 1) {
         return true;
      } else {
         return false;
      }
   },

   //cambia el estado del player a start:true y si el player es el owner de la room, llama al back para que cree la play
   async startUserPlay() {
      this.changeUserStatus({ start: true });
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

   async changeUserStatus(status: { connected: boolean } | { start: boolean }) {
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
};

export { state };
