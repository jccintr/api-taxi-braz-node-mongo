
import { WebSocketServer,WebSocket } from 'ws';
import jsonwebtoken from 'jsonwebtoken';



function verifyClient(info,callback){
   // console.log(info.req);
    return callback(true);
}


const websocket = (server) => {

  const wss = new WebSocketServer({server});

  
wss.on('connection', (ws, req) => {
 
   console.log('cliente conectado ao ws');
   //console.log(req.url);
   const token = req.url.substring(1);
   console.log('token do cliente',token);


  //  try {
    
  //  } catch (error) {
    
  //  }
   const decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET_PASSENGER);
   ws.id = decoded.passengerId;

  
  //  ws.send("Bem vindo ao ws taxi braz");


  ws.on('message', (msg, isBinary) => {
      wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(msg, { binary: isBinary });
          }
      });
  });

  ws.on('close', () => {
      console.log('WS Connection closed');
  });

});

  return wss;
}

export default websocket;


// module.exports = (server) => {

//     const wss = new webSocket.Server({
//        // port: process.env.PORT
//        server,
//        verifyClient
//     });

//    wss.on('connection', function connection(ws,req) {
//     console.log(new Date().toLocaleTimeString(),'Um novo cliente se conectou.');
//     console.log(new Date().toLocaleTimeString(),'Clientes conectados no momento:',wss.clients.size);
    
//     const name = req.url.split('=')[1];
//     ws.id = name;
//     ws.send('Olá '+ name);
//     ws.send(process.env.WELCOME_MESSAGE);
//     ws.on('error', console.error);
  
//     ws.on('message', function message(data) {
//       // tratar apenas as mensagens recebidas do back end
//       //console.log(ws.id);
//       console.log(new Date().toLocaleTimeString() + ' '+'Mensagem recebida de %s: %s',ws.id, data);
//       wss.clients.forEach(function each(client) {
//         //console.log(client.id);
//         if (client.readyState === webSocket.OPEN) {
//           client.send(new Date().toLocaleTimeString() + ' ' + data.toString());
//         }
//       });
//     });

//     ws.on('close', function close() {
//       console.log(new Date().toLocaleTimeString(),'Um cliente foi desconectado.');
//       console.log(new Date().toLocaleTimeString(),'Clientes conectados no momento:',wss.clients.size);
//     });
    
  
   
//   });
    


// console.log('WebSocket server is running at port '+ process.env.PORT);
// return wss;
// }
