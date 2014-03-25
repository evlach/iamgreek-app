function NodeLocation() {
	this.street = "";
	this.postCode = "";
	this.proximity = 0;
	this.city = "";
	this.country = "";
	this.latitude = 0;
	this.longitude = 0;
};
NodeLocation.create = function (obj) {
	var location = new NodeLocation();
	for ( var prop in location) {
		if(obj[prop]) location[prop] = obj[prop];
	}
	return location;
};

NodeLocation.toGoogleElement = function(location) {
	var googleUrl = "https://maps.google.com/maps?q="+location.latitude+","+location.longitude;
	var aGoogle = $("<a />")
		.attr("href",googleUrl)
		.attr("data-role","button")
		.attr("data-mini","true")
		.attr("target","new")
		.append(NodeLocation.toString(location))
		.button();
	return aGoogle;
};
NodeLocation.toString = function(location) {
	return location.street + ", " + location.city + 
			", " + location.postCode + ", "
			+ location.country
			//+ " (" + location.proximity + ")"
			;
};
NodeLocation.toHTMLElement = function(location) {
	return $("<p />").append(NodeLocation.toString(location));
};
NodeLocation.toHTMLElementDetails = function(location) {
	return $("<span />").append(NodeLocation.toString(location));

};