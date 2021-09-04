let hostID     = document.getElementById("HOSTroomID");
let JOINroomID = document.getElementById("JOINroomID");
let MessageSend = document.getElementById("MessageSend");
let MessageGet = document.getElementById("MessageGet");


let webRTC = new simpleWebRTC(null ,{
    connected : id => hostID.value = id,
    subscriber : data => getData(data),
    remoteMedia : data => getMedia(data),
    logger :  data => console.log(data),
    video : true,
    audio : true
});

const getData = data =>{

    MessageGet.value = MessageGet.value + data.data + '\n';
    if(data.data == 'call'){
        webRTC.beginCall(data.id);
    }
}

const getMedia = list => {
    document.getElementById("v2").srcObject = list[0].stream; 
}

const joinRoom = () => {
    webRTC.joinID(JOINroomID.value);
}

const sendMessage = () =>{
    webRTC.sendData(MessageSend.value);
}