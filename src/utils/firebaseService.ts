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

    public getGameById = (gameId: string, callbackF: (o: any) => void) => {
        if (!this.db) {
            return
        }
        this.db.collection("games")
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if (!doc.data().gameId) {
                        return;
                    }
                    if (doc.data().gameId.toString() === gameId.toString() && doc.data().target && doc.data().scrambled) {
                        callbackF({target: JSON.parse(doc.data().target), scrambled: JSON.parse(doc.data().scrambled)})
                    }
                })
            })
    }
    public createGame = (target: boardItemData[][], scrambled: boardItemData[][]) => {
        if (!this.db) {
            return
        }
        this.db.collection("games").doc("latest").get().then(s => {
            let latest = parseInt((s.data() as any).value);
            latest += 1;
            if (!this.db) {
                return
            }
            this.db.collection("games").add({
                status: "init",
                gameId: latest,
                scrambled: JSON.stringify(scrambled),
                target: JSON.stringify(target)
            })
            this.db.collection("games")
                .doc("latest")
                .update({value: latest})
        })
    }
}



