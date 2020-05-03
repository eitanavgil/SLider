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

    public getGameById = (gameId: string) => {
        if (!this.db) {
            return
        }
        this.db.collection("games")
            .where("gameId", "==", gameId).get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    console.log(">>>> doc", doc.data().target);
                    console.log(">>>> doc", doc.data().scrambled);
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


// db.collection("games").onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         if (change.type === "added") {
//             console.log(">>>> added", change.doc.data())
//         }
//         if (change.type === "removed") {
//             console.log(">>>> removed", change.doc.data())
//         }
//     })
// })


// get latest - TODO - target better
// db.collection("games").get().then(snapshot => {
//     snapshot.docs.forEach(i => {
//         if (i.id === "latest") {
//             console.log(">>>> latest", i.data())
//         }
//     })
// })
// advance latest 
// db.collection("games").doc("latest").update({value: 165})


// write to DB
// db.collection("games").add({
//     status: "init",
//     gameId: "167",
//     scrambled: JSON.stringify(scrambled),
//     target: JSON.stringify(target)
// })

