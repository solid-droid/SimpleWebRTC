# SimpleWebRTC
 Easy to use wrapper for peerJS WebRTC library

# Why
1. The SimpleWebRTC wrapper library will let you build a functional webRTC in  less than 5 lines of code.
2. Its a wrapper for peerJS library.
3. easily establish multi-pear connections.
 
# Usage

Add both files in your HTML
```html
    <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    <script src="simpleWebRTC.js"></script>
```
Javascript
 
```javascript
 //for custom id pass id:string instead of null
 
 const webRTC = new simpleWebRTC(null ,{
    connected : myID => { },                 // on connection to peerJS 
    subscriber : ({data, id}) => { },        // on recieving data from any connection 
    remoteMedia : list => {   },             // on recieving a remote media ( Audio / Video )
    //list = [ {id , stream},... ]
    logger :  data => console.log(data),     // logs everything
    video : true,                            // true to allow video stream
    audio : true                             // true to allow audio stream
});

```

# Methods

```javascript
//To connect to a remote node pass its id.
webRTC.joinID(id);

//To send message to all connected nodes
webRTC.sendData(message);

//To send message to one remote node
webRTC.sendData(message, id);

//To send message to one or more remote node
webRTC.sendData(message, [id1, id2, ..]);

//To begin Media stream to a specific remote node
webRTC.beginCall(id);

```
