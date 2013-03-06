var Messages = new Meteor.Collection("messages")

if (Meteor.isClient) {
  Template.messages.messages = function(){
    return Messages.find({}, {sort:{time: -1}})
  };


  Template.chatfields.events({
    "click .button" : function(){
      
      var latitude, longitude;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(show_pos)
      }
      function show_pos(position){
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        var $messageBox = $("#messageContent")
        var messageContent = $messageBox.val()
        var name = Meteor.user().profile.name
        $messageBox.val("");

        saveMessage(latitude, longitude, name, messageContent);
      }
      
      function saveMessage(latitude, longitude, name, messageContent){
        // console.log(messageContent)
        // TODO: veilig maken op de server
        var time = new Date();
        Messages.insert({"body" : messageContent, "name" : name, "latitude": latitude, "longitude": longitude, "time": time})
      }
      
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

}
