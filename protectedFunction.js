import io from 'socket.io-client';

const MyReactSocket = ()=> {
    //init socket and connected vars
    let socket = {};
    let connected = false;
    const addedEvents = [];
    
    //connect function initiates or confirms a connection. Requires:
        //1. host to connect to 
        //2. Optional: callback to run once connected
        //3. Optional: auth object to send in handshake
        //4. Optional: query object to send in handshake
        //5. Optional: options (in place of 4 and 5)
    const connect = (host,callbackWhenConnected,authObj,queryObj,options)=>{
        //initiate connection only if already connected
        if(!connected){
            socket = io.connect(
                window.apiHost ? window.apiHost : host,
                authObj ? {auth: authObj} : ``,
                queryObj ? {query: queryObj} : ``,
            );
            //run callback once connection is confirmed
            socket.on("connect", ()=> {
                connected = true;
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
    const close = ()=>{
        socket.close();
        connected = false;
    }

    //addEvent function adds a new event listener and requires:
    // 1. the event name
    // 2. optional callback to run
    const addEvent = (eventName,callback) =>{
        //see if this event has already been added, before adding
        const eventExists = addedEvents.find(e=>e===eventName)
        if(!eventExists){
            const callbackToRun = typeof callback === "function" ? callback : ()=>{}
            this.socket.on(eventName,callbackToRun)            
            this.events.push(eventName)
        }else{
            // console.log(`Did not ${eventName} add again`)
        }
    }

    //emitEvent function emits an event to the server
    const emitEvent = (eventName,data)=> {
        socket.emit(eventName,data);
    }
    return {
        connect,
        close,
        emitEvent,
        addEvent
    }
}

const socket = new MyReactSocket();

export default socket;

