import io from 'socket.io-client';

class MyReactSocket{
    constructor(){
        //init instance variables
        this.socket = {}; //socket connection
        this.connected = false; //bool used to check if socket is connected
        this.addedEvents = []; //array to hold added event listeners
    }

    //connect function initiates or confirms a connection. Requires:
        //1. host to connect to 
        //2. Optional: callback to run once connected
        //3. Optional: auth object to send in handshake
        //4. Optional: query object to send in handshake
        //5. Optional: options (in place of 4 and 5)
    connect = (host,callbackWhenConnected,authObj,queryObj,options)=>{
        //initiate connection only if not already connected
        if(!this.connected){
            this.socket = io.connect(
                host,
                authObj ? {auth: authObj} : ``,
                queryObj ? {query: queryObj} : ``,
                options ? options : ``
            );
            //run callback once connection is confirmed
            this.socket.on("connect", ()=> {
                this.connected = true;
                if(typeof callbackWhenConnected === "function"){
                    callbackWhenConnected();
                };
              });            
        }else{
            //still run the callback in the event socket was already connected
            callbackWhenConnected();
        }
    }

    //close function terminates the connection
    close = ()=>{
        this.socket.close();
        this.connected = false;
    }

    //addEvent function adds a new event listener and requires:
    // 1. the event name
    // 2. optional callback to run
    addEvent = (eventName,callback) =>{
        //see if this event has already been added, before adding
        const eventExists = this.addedEvents.find(e=>e===eventName)
        if(!eventExists){
            const callbackToRun = typeof callback === "function" ? callback : ()=>{}
            this.socket.on(eventName,callbackToRun)
            this.addedEvents.push(eventName)
        }else{
            // console.log(`Did not ${eventName} add again`)
        }
        
    }
    
    //emitEvent function emits an event to the server
    emitEvent = (eventName,data) =>{
        this.socket.emit(eventName,data);
    }
}

const socket = new MyReactSocket();

export default socket;

