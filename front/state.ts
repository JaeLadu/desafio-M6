import { connect } from "http2";
import { forEachChild } from "typescript";

const HOST = process.env.HOST || "http://localhost:3000";
const state = {
   data: {
      user: {},
      // room: {
      //    users: [],
      // },
   },
   subscribed: [],

   getState() {
      if (!this.data.user.name) {
         this.checkLocalStorage();
      }
      return this.data;
   },

   setState(newState) {
      this.data = { ...newState };
      this.saveToLocalStorage();
      console.log(this.getState());
   },

   subscribe(subscriberFunction) {
      this.subscribed.push(subscriberFunction);
   },

   checkLocalStorage() {
      const localData = localStorage.getItem("multiplayerRockPaperScissors");
      if (localData) {
         const oldState = this.data;
         const newState = { oldState, ...JSON.parse(localData) };
         this.setState(newState);
      }
   },

   saveToLocalStorage() {
      localStorage.setItem(
         "multiplayerRockPaperScissors",
         JSON.stringify(this.getState())
      );
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
         data = this.signup(userData);
      }

      //vuelve a checkear por el id en caso de que signup falle
      if (data.id) {
         const state = this.getState();
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
         this.setState(newState);
         this.connectUser();
      }
   },

   async accessRoom(roomId) {
      const oldState = this.getState();
      const response = await fetch(
         `${HOST}/rooms/${roomId}?mail=${oldState.user.mail}`
      );
      const data = await response.json();

      if (data.firestoreId) {
         const newRoom = { ...oldState.room, ...data };
         const newState = oldState;
         newState.room = newRoom;

         //CODIGO PARA PRUEBAS, ELIMINAR
         newState.room.users[0].online = true;
         newState.room.users.push({ name: "otro", online: true });
         //----------------------------------

         this.setState(newState);
         this.connectUser();
      }
      return data;
   },

   checkBothUsersOnline() {
      const currentState = this.getState();
      const users = currentState.room.users;
      const usersOnline = users.filter((user) => {
         return user.online == true;
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
         user.start == true;
      });

      if (usersStart.length > 1) {
         return true;
      } else {
         return false;
      }
   },

   connectUser(userId) {
      const currentState = this.getState();
      const newState = currentState;
      newState.user.online = true;
      this.setState(currentState);
      //avisa a firebase que está online, para es es el userId
   },

   disconnectUser(userId) {
      const currentState = this.getState();
      const newState = currentState;
      newState.user.online = false;
      this.setState(currentState);
      //avisa a firebase que está offline, para es es el userId
   },
};

export { state };
