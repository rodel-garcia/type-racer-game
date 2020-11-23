export const auth = {
  signIn: (email, password) =>
    window.firebase.auth().signInWithEmailAndPassword(email, password),
  signOut: () => window.firebase.auth().signOut(),
  checkAuthState: (callback) =>
    window.firebase.auth().onAuthStateChanged((user) => callback(user)),
};

export const dataBase = {
  addNewData: (data) => {
    const postListRef = window.firebase.database().ref('history/');
    const newPostRef = postListRef.push();
    newPostRef.set(data, (error) => error && console.log(error));
  },
  getHistory: () => {
    return window.firebase.database().ref('/history/').once('value');
  },
};
