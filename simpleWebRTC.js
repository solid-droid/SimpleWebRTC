class simpleWebRTC {
    #lastPeerId = null;
    #peer = null;
    #conn = [];
    #connectedID = [];
    remoteStream = [];
    #id = null;
    getUserMedia;
    subscriber;
    logger;
    connected;
    remoteMedia;
    video = false;
    audio = false;

    constructor (id = null, {connected, subscriber,logger , remoteMedia , video , audio }
        ={connected, subscriber:null,logger:null, remoteMedia:null , video :false, audio:false})
    {
        this.subscriber = subscriber;
        this.logger = logger;
        this.connected = connected;
        this.remoteMedia = remoteMedia;
        this.video = video;
        this.audio = audio;
        this.#init(id);
    }

    #init(id){
        this.#peer = new Peer(id, {
            debug: 2
        });
        this.#peer.on('open', () => {
            // Workaround for peer.reconnect deleting previous id
            if (this.#peer.id === null) {
                this.#sendLog('Received null id from peer open');
                this.#peer.id = this.#lastPeerId;
            } else {
                this.#lastPeerId = this.#peer.id;
            }
            this.#id = this.#peer.id;
            if(this.connected){
                this.connected(this.#id);
            }
            this.#sendLog(`ID : ${this.#id}`);
        });

        this.#peer.on('connection', c => {

            this.#conn.push(c);
            this.#connectedID.push(this.#conn[this.#conn.length-1].peer);
            this.#sendLog("Connected to: " + this.#conn[this.#conn.length-1].peer);
            this.#beginConnection(this.#conn[this.#conn.length-1]);
        });

        this.#peer.on('disconnected',  () => {
            this.#sendLog('Connection lost');
            this.#peer.id = this.#lastPeerId;
            this.#peer._lastServerId = this.#lastPeerId;
            this.#peer.reconnect();
        });

        this.#peer.on('close', () => {
            this.#conn = [];
            this.#connectedID = [];
            this.#sendLog('Connection destroyed');
        });
        this.#peer.on('error', err => {
            this.#sendLog(err);
        });

        if(this.video || this.audio){
            this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            this.acceptCall();
        }
    }

    getMyID(){
        return this.#id;
    }
    getConnectedID(){
        return this.#connectedID;
    }

    joinID(id) {
        const _conn = this.#peer.connect(id, {
            reliable: true
        });
        this.#conn.push(_conn);
        this.#conn[this.#conn.length-1].on('open', () => {
            this.#sendLog("Connected to: " + _conn.peer);
        });
        this.#connectedID.push(this.#conn[this.#conn.length-1].peer);
        this.#beginConnection(this.#conn[this.#conn.length-1]);
      
    }

    #beginConnection(conn){
        conn.on('data', data => {
            this.#sendLog(`${conn.peer} :=> ${data}`);
            this.#getData(data,conn.peer);
        });
        conn.on('close', () => {
            this.#sendLog(`connection closed from ${conn.peer}`);
            this.#connectedID.splice(this.#connectedID.indexOf(conn.peer), 1);
        });
    }

    sendData(data , id=null){
        let connList = [];
        if(typeof id == 'string') {
            connList.push(this.#conn[this.#connectedID.findIndex(id)]);
        } else if (Array.isArray(id)) {
            id.forEach(_id => {
                connList.push(this.#conn[this.#connectedID.findIndex(_id)]);
            })
        } else {
            connList = this.#conn;
        }
        connList.forEach(conn => {
            if (conn && conn.open) {
                conn.send(data);
               this.#sendLog("Sent: " + data);
            } else {
                this.#sendLog('Connection is closed');
            }
        });
        return true;        
    }

    #getData(data, id){
        if(this.subscriber){
            this.subscriber({id , data});
        }
    }

    #sendLog(data){
        if(this.logger){
            this.logger(data);
        }
    }

    acceptCall() {
        this.#peer.on('call', call => {
        this.getUserMedia({video: this.video, audio: this.audio}, stream => {
            call.answer(stream);
            let once = true;
            call.on('stream', remoteStream => {
                if(once){
                    this.remoteStream.push({id : call.peer , stream : remoteStream}); 
                    this.getRemoteMedia();
                    once = false;
                }
            } , err => this.#sendLog(err));
         });
        });
    }

    beginCall(id , {video , audio} = {video : true , audio: true}){
        this.getUserMedia({video, audio}, stream => {
            const call = this.#peer.call(id, stream);  
            let once = true;
            call.on('stream', remoteStream => {
                if(once){
                    this.remoteStream.push({id : call.peer , stream : remoteStream}); 
                    this.getRemoteMedia();
                    once = false;
                }
            } , err => this.#sendLog(err));  
        });
    }

    getRemoteMedia(){
        if(this.remoteMedia){
            this.remoteMedia(this.remoteStream)
        }
    }
}
