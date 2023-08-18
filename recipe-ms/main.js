//DEFAULT PATH FROM NODEJS
const path = require("path");

// GRPC JAVASCRIPT MODULES
const grpc = require("@grpc/grpc-js");

// LIBRARY FOR LOADING FROM PROTO FILES TO JAVASCRIPT (DYNAMIC, ON RUNNING OF SERVER)
const protoLoader = require("@grpc/proto-loader");

//CREATE PACKAGE FROM THE PROTO FILE
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../protos/recipes.proto")
);

//LOAD THE CREATED PACKAGE
const recipesProto = grpc.loadPackageDefinition(packageDefinition);

//SIMULATION OF DATABASE
const RECIPES = [
  {
    id: 100,
    productId: 1000,
    title: "Pizza",
    notes: "See video: pizza_recipe.mp4. Use oven No. 12",
  },
  {
    id: 200,
    productId: 2000,
    title: "Lasagna",
    notes: "Ask from John. Use any oven, but make sure to pre-heat it!",
  },
];

//FUNCTION WHICH WILL QUERY MY DATABASE
function findRecipe(call, callback) {
  let recipe = RECIPES.find((recipe) => recipe.productId == call.request.id);
  if (recipe) {
    callback(null, recipe);
  } else {
    callback({
      message: "Recipe not found",
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}

//INITIALIZATION OF GRPC SERVER
const server = new grpc.Server();
//BINDING FUNCTION 'findRecipe' to 'find' SERVICE DESCRIBED IN PROTO
server.addService(recipesProto.Recipes.service, { find: findRecipe });

//MAKE SERVER LISTENING PORT 50051
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
