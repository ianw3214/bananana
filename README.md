# Bananana

This project is a club penguin clone but will be better in every aspect (I hope)

## TEMPORARY DOCUMENTATION STUFF

Each subsystem will directly handle sending to the websocket, however the socket will handle the incoming commands and call the corresponding functions itself so there is no need to poll incoming commands or anything.

On the server, commands should be batched so they can be sent in a single go. Commands on the client can be batched per frame as well, perhaps even longer time intervals depending on the action being used - can investigate in the future.