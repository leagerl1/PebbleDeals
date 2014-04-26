// Function to send a message to the Pebble using AppMessage API
function sendMessage(alert,title) {
	Pebble.sendAppMessage({"status": 0, "message": "Hi Pebble, I'm a Phone!"});
	Pebble.showSimpleNotificationOnPebble(title,alert);
	// PRO TIP: If you are sending more than one message, or a complex set of messages, 
	// it is important that you setup an ackHandler and a nackHandler and call 
	// Pebble.sendAppMessage({ /* Message here */ }, ackHandler, nackHandler), which 
	// will designate the ackHandler and nackHandler that will be called upon the Pebble 
	// ack-ing or nack-ing the message you just sent. The specified nackHandler will 
	// also be called if your message send attempt times out.
}

function locationSuccess(pos) {
  var crd = pos.coords;
  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');
}

function locationError(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

var options = {
  maximumAge: Infinity
};

// Called when JS is ready
Pebble.addEventListener("ready",
							function(e) {
							});
												
// Called when incoming message from the Pebble is received

Pebble.addEventListener("appmessage",
							function(e) {
                window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,options);
								var req = new XMLHttpRequest();
                //req.open('GET', 'http://api.citygridmedia.com/content/offers/v2/search/latlon?what=restaurant&lat=40.631021&lon=-73.599200&format=json&radius=5&publisher=10000005764', true);
                req.open('GET', 'http://api.citygridmedia.com/content/offers/v2/search/latlon?what=bar&lat=40.759193&lon=-73.984885&format=json&radius=5&publisher=10000005764', true);                 
                //req.open('GET', 'http://api.citygridmedia.com/content/offers/v2/search/latlon?what=restaurant&lat=41.149168&lon=-73.980899&format=json&radius=5&publisher=10000005764', true);          
                req.onload = function(e) {
                      if (req.readyState == 4 && req.status == 200) {
                          if(req.status == 200) {
                            console.log("This is workign");
                            var response = JSON.parse(req.responseText);  
                            var alert = response.results.offers[0].title;
                            var title = response.results.offers[0].locations[0].name;
                            sendMessage(alert,title);
                          } 
                          else { console.log("Error"); }
                      }
                  };
                
                req.send(null);
          
                console.log("Received Status: " + e.payload.status);
								console.log("Received Message: " + e.payload.message);
							});