import "firebase/firestore";
import firebase from "firebase/app";
import { boardItemData } from "../components/boards/Board/Board";
import { GameState } from "../App";

export class FirebaseService {
  db: firebase.firestore.Firestore | undefined;

  constructor() {
    if (this.db) {
      return;
    }

    const firebaseConfig = {};
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    // debug helper - TODO - remove
    (window as any).db = this.db;
  }
  public listenToChange = (gameId: number, callback: (o: any) => void) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
      .doc(gameId.toString())
      .onSnapshot((snapshot) => {
        callback(snapshot.data());
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
    var promise = new Promise((resolve, reject) => {
      if (!this.db) {
        return;
      }
      let namesRef = game.toString();
      this.db
        .collection("games")
        .doc(game.toString())
        .get()
        .then((snapshot) => {
          if (!snapshot || !snapshot.data() || !snapshot.data()!.names) {
            reject({ error: "Wrong game number" });
            return;
          }
          let currentAr = (snapshot.data() as any).names as [];
          // @ts-ignore
          if (currentAr.find((item) => item.name === user)) {
            reject({ error: "User already exist" });
            return;
          }
          const gameData = snapshot.data();
          // @ts-ignore
          currentAr.push({ name: user, score: 0 });
          this.db!.collection("games")
            .doc(game.toString())
            .update({ names: currentAr })
            .then((snapshot) => {
              resolve({ gameData });
            });
        })
        .catch(() => {
          reject({ error: "Wrong game number" });
        });
    });
    return promise;
  };

  public submitScore = (name: string, gameId: number, score: string) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
      .doc(gameId.toString())
      .get()
      .then((snapshot) => {
        let names = (snapshot.data() as any).names as [];
        const newNames = names.map((item: any) => {
          if (item.name === name) {
            item.score = score;
          }
          return item;
        });
        if (newNames.length) {
          this.db!.collection("games").doc(gameId.toString()).update({
            names: names,
          });
        }
      });
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
          this.db
            .collection("games")
            .doc(latest.toString())
            .set({
              gameId: latest.toString(),
              status: GameState.lobby,
              names: [],
              scrambled: JSON.stringify(scrambled),
              target: JSON.stringify(target),
            });
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
