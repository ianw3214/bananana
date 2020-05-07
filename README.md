# Bananana

This project is a club penguin clone but will be better in every aspect (I hope)

## TEMPORARY DOCUMENTATION STUFF

Each subsystem will directly handle sending to the websocket, however the socket will handle the incoming commands and call the corresponding functions itself so there is no need to poll incoming commands or anything.

On the server, commands should be batched so they can be sent in a single go. Commands on the client can be batched per frame as well, perhaps even longer time intervals depending on the action being used - can investigate in the future.

On the server side, gameplay systems can use a 'key' system where they register their services into a dictionary. Then, interactables can use that key as a quick way to reference the systems.

The server usually broadcasts the commands to each client, since none of the game state is handled on the client side. However, there are cases where we want to send messages to just a client, for things like requesting inventory data or other client specific data.

## TODOs (GAME)

- Serialize map objects so things aren't hard coded
- Different maps
- Chop trees
- ~Player customization~
  - **Better** player customization
- Better login screen
- ~Player animations~
- ~Rendering order~
- Loop music
- Areas that players can't move into
- Better text rendering
- Cache inventory and only update when changed
- fullscreen support
- Loading cursor when waiting for server response
  - Need a timeout system for this as well (so we don't load forever)

## TODOs (SERVER)

- Cache inventory on server side, only update to database once in a while
- Use asynch for database operations so it doesn't wait on these calls
- Inventory limit (Don't catch fish once limit reached)
- Compress data before sending? - maybe not super important until bandwidth becomes an issue

## TODOs (OTHER)

- Centralized data source for shared data between server/client
- Make id vs name more clear and consistent
