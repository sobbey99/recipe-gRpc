//DEFAULT PATH FROM NODEJS
const path = require("path");
// GRPC JAVASCRIPT MODULES
const grpc = require("@grpc/grpc-js");
// LIBRARY FOR LOADING FROM PROTO FILES TO JAVASCRIPT (DYNAMIC, ON RUNNING OF SERVER)
const protoLoader = require("@grpc/proto-loader");

//CREATE PACKAGE FROM THE PROTO FILE
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../protos/processing.proto")
);

//LOAD THE CREATED PACKAGE
const processingProto = grpc.loadPackageDefinition(packageDefinition);

//STREAM FUNCTION, RECEIVED ORDER AND UPDATING STATUS AFTER A WHILE
function process(call) {
  let orderRequest = call.request;
  let time = orderRequest.orderId * 1000 + orderRequest.recipeId * 10;

  call.write({ status: 2 });
  setTimeout(() => {
    call.write({ status: 3 });
    setTimeout(() => {
      call.write({ status: 4 });
      call.end(); // CLOSING THE SCREAM CONECTION
    }, time);
  }, time);
}

const server = new grpc.Server();
server.addService(processingProto.Processing.service, { process });
server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
