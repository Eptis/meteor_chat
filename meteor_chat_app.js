var Messages = new Meteor.Collection("messages")
var CurPos = {};
var range = 1000; // in meters






if (Meteor.isClient) {


  /** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
Template.messages.rendered = function ( ) { 
      getPos();

 }


    function getPos(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(show_pos)
      }
      function show_pos(position){
        CurPos.latitude = position.coords.latitude;
        CurPos.longitude = position.coords.longitude;
        // console.log(CurPos)
        calcDist()
      }

    
        function calcDist(){

          $("#messages .message").each(function(){
            var lat1 = $(this).data("lat") // lat1
            var lon1 = $(this).data("lon") //lon1
            var lat2 = CurPos.latitude  // lat2
            var lon2 = CurPos.longitude // lon2

            var R = 6371; // km Radius Earth
            var dLat = (lat2-lat1).toRad();
            var dLon = (lon2-lon1).toRad();
            var lat1 = lat1.toRad();
            var lat2 = lat2.toRad();

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var distance = (R * c)*1000;

            if( distance < range){
                $(this).removeClass("hide")              
            }
            
          })
              
        }

        setInterval(function(){
          calcDist();
        },10000)


    }

    getPos();

  Template.messages.messages = function(){

      
       return Messages.find({}, {sort: {"time": -1}});
    
  };

 



  Template.chatfields.events({
    "click .button" : function(e){
        e.preventDefault()

        var $messageBox = $("#messageContent")
        var messageContent = $messageBox.val()
        var name = Meteor.user().profile.name
        $messageBox.val("");

        var latitude = CurPos.latitude
        var longitude = CurPos.longitude


        saveMessage(latitude, longitude, name, messageContent);

      
    }
  });


  function saveMessage(latitude, longitude, name, messageContent){
        // console.log(messageContent)
        // TODO: veilig maken op de server
        var time_human = new Date();
        time = Date.parse(time_human)
        Messages.insert({
          "body" : messageContent, 
          "name" : name, 
          "lon": longitude,
          "lat": latitude,
          "time": time,
          "time_human": time_human
        })
      }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  

  

}
