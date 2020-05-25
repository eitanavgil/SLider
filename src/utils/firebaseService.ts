import "firebase/firestore";
import firebase from "firebase/app";
import { boardItemData } from "../components/boards/Board/Board";
import { GameState } from "../App";

export class FirebaseService {
  db: firebase.firestore.Firestore | undefined;

  constructor() {
    const firebaseConfig = {};
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    // debug helper - TODO - remove
    (window as any).db = this.db;
  }
  public listenToChange = (gameId: number, callback: (o: any) => void) => {
    if (!this.db || !gameId) {
      return;
    }
    this.db
      .collection(`games`)
      .doc(gameId.toString())
      .onSnapshot((snapshot) => {
        callback(snapshot.data());
      });
  };

  public listenToTableChange = (gameId: number, callback: (o: any) => void) => {
    if (!this.db || !gameId) {
      return;
    }
    this.db.collection(`games/${gameId}/players`).onSnapshot((snapshot) => {
      const players = snapshot.docs.map((doc) => doc.data());
      callback(players);
    });
  };

  // public listenToNames = (gameId: number, callback: (o: any) => void) => {
  //   if (!this.db) {
  //     return;
  //   }
  //   this.db.collection("games").onSnapshot((snapshot) => {
  //     let changes = snapshot.docChanges();
  //     changes.forEach((change) => {
  //       if (
  //         change.doc &&
  //         change.doc.data() &&
  //         change.doc.data().gameId &&
  //         change.doc.data().gameId !== gameId.toString()
  //       ) {
  //         return;
  //       }
  //       if (change.type === "added") {
  //         if (change.doc.data().gameId === gameId.toString()) {
  //           callback({ names: change.doc.data().names });
  //         }
  //       }
  //       if (change.type === "modified") {
  //         if (change.doc.data().gameId === gameId.toString()) {
  //           callback({ names: change.doc.data().names });
  //         }
  //       }
  //     });
  //   });
  // };

  public addUserToGame = (user: string, game: number) => {
    const promise = new Promise((resolve, reject) => {
      if (!this.db) {
        return;
      }
      // todo - handle existing user collision
      let namesRef = game.toString();
      this.db
        .collection(`games/${game}/players/`)
        .doc(user)
        .set({ name: user, score: "" })
        .then(() => {
          this.db!.collection("games")
            .doc(game.toString())
            .get()
            .then((snapshot) => {
              const gameData = snapshot.data();
              resolve({ gameData });
            })
            .catch((e) => {
              reject({ error: e });
            });
        });
    });
    return promise;
  };

  public submitScore = (name: string, gameId: number, score: string) => {
    if (!this.db) {
      return;
    }
    this.db
      .doc(`games/${gameId}/players/${name}`)
      .update({ score: score.toString() });

    // TODO - return promise
  };

  public getGameById = (gameId: number) => {
    var promise = new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: "Database not ready" });
      }
      this.db!.collection("games")
        .doc(gameId.toString())
        .get()
        .then((snapshot) => {
          const gameData: any = snapshot.data();
          if (!gameData) {
            reject({ message: "Game not found!" });
            return;
          }
          if (gameData.target && gameData.scrambled) {
            resolve({
              target: JSON.parse(gameData.target),
              scrambled: JSON.parse(gameData.scrambled),
            });
            return;
          }
          reject({ message: "Game not found!" });
        })
        .catch(() => {
          reject({ message: "Error" });
        });
    });
    return promise;
  };
  // admin switch from lobby to playing - releasing the lobby UI
  public startGame = (gameId: number) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
      .doc(gameId.toString())
      .update({ status: GameState.playing });
  };

  public endGame = (gameId: number) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
      .doc(gameId.toString())
      .update({ status: GameState.end });
  };

  public createGame = (
    target: boardItemData[][],
    scrambled: boardItemData[][]
  ) => {
    var promise = new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: "Database not ready" });
      }
      this.db!.collection("games")
        .doc("latest")
        .get()
        .then((s) => {
          let latest = parseInt((s.data() as any).value);
          latest += 1;
          if (!this.db) {
            return;
          }
          // generate a new game
          this.db
            .collection("games")
            .doc(latest.toString())
            .set({
              gameId: latest.toString(),
              status: GameState.lobby,
              scrambled: JSON.stringify(scrambled),
              target: JSON.stringify(target),
            })
            .then(() => {
              var db = firebase.firestore();
              var playersCollection = db
                .collection("games")
                .doc(latest + "")
                .collection("players");
              playersCollection
                .doc("initiated-app")
                .set({ admin: true })
                .then(function () {
                  console.log("Document Added ");
                })
                .catch(function (error) {
                  console.error("Error adding document: ", error);
                });
            });
          // increase global index
          this.db
            .collection("games")
            .doc("latest")
            .update({ value: latest })
            .then(() => {
              resolve(latest);
            });
        });
    });
    return promise;
  };
}
