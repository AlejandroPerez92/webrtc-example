import autobahn from 'autobahn-browser'
import {acceptConnection, selfId, startConnection} from "./main.js";

let connection = new autobahn.Connection({
    url: 'ws://localhost:8088',
    realm: 'realm1',
})

connection.onopen = (session) => {
    console.log('starting wamp connection');
    session.register(`${selfId}.receive-offer`, async (message) => {
        document.getElementById('remoteSessionDescription').value = message;
        console.log(`new WebRTC connection requested`);
        const myConnectionInfo = await acceptConnection(JSON.parse(message));
        return JSON.stringify(myConnectionInfo);
    })
}

connection.open();

export async function requestConnectionTo(id, offer) {
    let answer = await connection.session.call(`${id}.receive-offer`, [offer]);
    console.log(answer)
    const sd = document.getElementById('remoteSessionDescription');
    sd.value = answer;
    await startConnection(JSON.parse(answer));
    console.log(`new WebRTC connection accepted`);
}