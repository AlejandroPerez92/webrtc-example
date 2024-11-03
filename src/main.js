import {requestConnectionTo} from "./wamp-signaling.js";

export const selfId = crypto.randomUUID();

const localPeerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
})

const log = msg => {
  document.getElementById('logs').innerHTML += msg + '<br>'
}

let sendChannel = localPeerConnection.createDataChannel('foo')
sendChannel.onclose = () => console.log('sendChannel has closed')
sendChannel.onopen = () => console.log('sendChannel has opened')
sendChannel.onmessage = e => log(`Message from DataChannel '${sendChannel.label}' payload '${e.data}'`)

localPeerConnection.oniceconnectionstatechange = e => log(localPeerConnection.iceConnectionState)
localPeerConnection.onicecandidate = event => {
  if (event.candidate === null) {
    document.getElementById('localSessionDescription').value = JSON.stringify(localPeerConnection.localDescription)
  }
}

localPeerConnection.onnegotiationneeded = e =>
  localPeerConnection.createOffer().then(d => localPeerConnection.setLocalDescription(d)).catch(log)

localPeerConnection.ondatachannel = (event) => {
  console.log('new data channel opened');
  sendChannel = event.channel;
  sendChannel.onclose = () => console.log('sendChannel has closed')
  sendChannel.onopen = () => console.log('sendChannel has opened')
  sendChannel.onmessage = e => log(`Message from DataChannel '${sendChannel.label}' payload '${e.data}'`)
}

export function sendMessage() {
  const message = document.getElementById('message').value
  if (message === '') {
    return alert('Message must not be empty')
  }

  sendChannel.send(message)
}

export function startSession() {
  const remoteUuid = document.getElementById('remoteUuid').value
  requestConnectionTo(remoteUuid, JSON.stringify(localPeerConnection.localDescription));
}

/**
 * @param {RTCSessionDescriptionInit} remoteDescription
 * @returns {RTCSessionDescription}
 */
export async function acceptConnection(remoteDescription) {

  try {
    await localPeerConnection.setRemoteDescription(remoteDescription);
    const answer = await localPeerConnection.createAnswer();
    await localPeerConnection.setLocalDescription(answer);
    return localPeerConnection.localDescription;
  } catch (e) {
    alert(e)
  }
}

/**
 * @param {RTCSessionDescriptionInit} remoteDescription
 * @returns {Promise<void>}
 */
export async function startConnection(remoteDescription) {

  try {
    await localPeerConnection.setRemoteDescription(remoteDescription);
    console.log("Connected to the peer");
  } catch (e) {
    alert(e)
  }
}

window.onload = () => {
  document.getElementById('startSessionBtn').addEventListener('click', startSession);
  document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
  console.log(`Your id is ${selfId}`);
  document.getElementById('localUuid').value = selfId;
}
