import firebase from "firebase/app";
import "firebase/firestore";
import {boardItemData} from "../components/boards/Board/Board";

export class FirebaseService {

    db: firebase.firestore.Firestore | undefined;

    constructor() {
        const firebaseConfig = {

        };
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
        // debug helper - TODO - remove
        (window as any).db = this.db
    }

    public addUserToGame = (user: string, game: number, callback: (o: any) => void) => {

        if (!this.db) {
            return
        }

        let namesRef =
            this.db.collection('games')
                .doc(game.toString())
                .get()
                .then((snapshot) => {
                    let currentAr = (snapshot.data() as any).names as [];
                    // @ts-ignore
                    if (currentAr.find(item => item.name === user)) {
                        alert("Existing user")
                        return;
                    }
                    // @ts-ignore
                    currentAr.push({name: user, score: 0});

                    this.db!.collection('games')
                        .doc(game.toString())
                        .update({names: currentAr})
                        .then(snapshot => {
                            this.getGameById(game, callback)
                        })

                })

    }
    public submitScore = (name: string, gameId: number, score: number) => {
        if (!this.db) {
            return
        }
        this.db.collection("games")
            .doc(gameId.toString())
            .get().then((snapshot) => {
            let names = (snapshot.data() as any).names as [];
            const newNames = names.map((item: any) => {
                if (item.name === name) {
                    item.score = score;
                }
                return item;
            })
            if (newNames.length) {
                this.db!.collection("games").doc(gameId.toString()).update({
                    names: names
                })
            }
        })
    }

    public getGameById = (gameId: number, callbackF: (o: any) => void) => {
        if (!this.db) {
            return
        }
        this.db.collection("games")
            .doc(gameId.toString())
            .get()
            .then((snapshot) => {
                const gameData: any = snapshot.data()
                if (!gameData) {
                    callbackF({message: "Game not found!"})
                    return;
                }
                if (gameData.target && gameData.scrambled) {
                    callbackF({
                        target: JSON.parse(gameData.target),
                        scrambled: JSON.parse(gameData.scrambled)
                    })
                    return;
                }
                callbackF({message: "Game not found!"})
            })
            .catch(() => {
                callbackF({message: "Error"})
            })
    }
    public startGame = (gameId: number) => {
        if (!this.db) {
            return
        }
        this.db.collection("games").doc(gameId.toString()).update({status: "started"})
    }
    public endGame = (gameId: number) => {

    }

    public createGame = (target: boardItemData[][], scrambled: boardItemData[][], callback: (v: any) => void) => {
        if (!this.db) {
            return
        }
        this.db.collection("games").doc("latest").get().then(s => {
            let latest = parseInt((s.data() as any).value);
            latest += 1;
            if (!this.db) {
                return
            }

            this.db.collection("games").doc(latest.toString()).set({
                status: "init",
                names: [],
                scrambled: JSON.stringify(scrambled),
                target: JSON.stringify(target)
            })

            this.db.collection("games")
                .doc("latest")
                .update({value: latest})
                .then(() => {
                    callback(latest);
                })
        })
    }
}



