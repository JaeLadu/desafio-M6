const HOST = process.env.HOST || "http://localhost:3000";
const state = {
   data: {
      user: {},
   },
   subscribed: [],

   getState() {
      return this.data;
   },

   setState(newState) {
      this.data = { ...newState };
   },

   subscribe(subscriberFunction) {
      this.subscribed.push(subscriberFunction);
   },

   checkLocalStorage() {
      const localData = localStorage.getItem("onlineRPS");
      if (localData) {
         const oldState = this.getState();
         const newState = { oldState, ...JSON.parse(localData) };
         this.setState(newState);
      }
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
         const newState = { ...oldState, room: data };
         this.setState(newState);
      }
   },
};

export { state };
