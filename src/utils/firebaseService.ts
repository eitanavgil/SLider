import "firebase/firestore";
import { GameState } from "../App";
import firebase from "firebase/app";
import { boardItemData } from "../components/boards/Board/Board";

export class FirebaseService {
  db: firebase.firestore.Firestore | undefined;

  constructor() {
    const firebaseConfig = {};
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    // debug helper - TODO - remove
    (window as any).db = this.db;
  }

  public listenToNames = (gameId: number, callback: (o: any) => void) => {
    this.db!.collection("games").onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (
          change.doc &&
          change.doc.data() &&
          change.doc.data().gameId &&
          change.doc.data().gameId !== gameId.toString()
        ) {
          return;
        }
        if (change.type === "added") {
          if (change.doc.data().gameId === gameId.toString()) {
            callback({ names: change.doc.data().names });
          }
        }
        if (change.type === "modified") {
          if (change.doc.data().gameId === gameId.toString()) {
            callback({ names: change.doc.data().names });
          }
        }
      });
    });
  };

  public addUserToGame = (
    user: string,
    game: number,
    callback: (o: any) => void
  ) => {
    if (!this.db) {
      return;
    }
    let namesRef = game.toString();
    this.db
      .collection("games")
      .doc(game.toString())
      .get()
      .then((snapshot) => {
        let currentAr = (snapshot.data() as any).names as [];
        // @ts-ignore
        if (currentAr.find((item) => item.name === user)) {
          alert("Existing user");
          return;
        }
        // @ts-ignore
        currentAr.push({ name: user, score: 0 });
        this.db!.collection("games")
          .doc(game.toString())
          .update({ names: currentAr })
          .then((snapshot) => {
            this.getGameById(game, callback);
          });
      });
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

  public getGameById = (gameId: number, callbackF: (o: any) => void) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
      .doc(gameId.toString())
      .get()
      .then((snapshot) => {
        const gameData: any = snapshot.data();
        if (!gameData) {
          callbackF({ message: "Game not found!" });
          return;
        }
        if (gameData.target && gameData.scrambled) {
          callbackF({
            target: JSON.parse(gameData.target),
            scrambled: JSON.parse(gameData.scrambled),
          });
          return;
        }
        callbackF({ message: "Game not found!" });
      })
      .catch(() => {
        callbackF({ message: "Error" });
      });
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
    scrambled: boardItemData[][],
    callback: (v: any) => void
  ) => {
    if (!this.db) {
      return;
    }
    this.db
      .collection("games")
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
            callback(latest);
          });
      });
  };
}
