exports.exec = function(msg, command, args) {
  msg.channel.send("Example of a " + args[1] + " " + args[0]);
}