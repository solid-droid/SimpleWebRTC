# SimpleWebRTC
 Easy to use wrapper for peerJS WebRTC library  
 [Live Demo](https://solid-droid.github.io/SimpleWebRTC/)

# Why
1. Build a functional webRTC in  less than 10 lines of code.
2. Its a wrapper for peerJS library.
3. easily establish multi-node connections.
4. inbuilt Auto sync all nodes to create a mesh network.

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
    onInit      : myID => { },                 // on connection to peerJS 
    onMessage   : ({data, id}) => { },         // on recieving data from any node 
    remoteMedia : list => {   },               // on recieving a remote media (Audio/Video)
                                               // list = [ {id , stream},... ]
    onSync      : id => { ... },               // on adding a new node in network
    logger      : data => console.log(data),   // logs everything
    video       : true,                        // true to allow video stream
    audio       : true                         // true to allow audio stream
});

```

# Methods

```javascript
//To connect to the network by passing any remote node id.
//Auto sync will take care of connecting in all nodes.
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

# Attributes

```javascript
//my id
webRTC.id : string

//connected remote id list
webRTC.connectedID : string array

//remote stream list
webRTC.remoteStream : object array

```
