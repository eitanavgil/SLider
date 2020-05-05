import React, {Fragment} from "react";

export interface tableItem {
    name: string;
    score: number
}

export interface props {
    data?: tableItem[];
}


const ScoreBoard = (props: props) => {
    return <Fragment>
        {props.data && props.data.length &&
        <div>

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.data.map((usr: any, index) => {
                        return <tr key={index}>
                            <td>{usr.name}</td>
                            <td>
                                {usr.score !== 0 && <span>{usr.score}</span>}
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>


        </div>
        }
        {!props.data && <div></div>}
    </Fragment>
};
export default ScoreBoard;
