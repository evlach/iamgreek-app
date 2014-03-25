function Happening() {
	this.nodeId = 0;
	this.body="";
	this.title = "default";
	this.description = "";
	this.date_start = "";
	this.date_end = "";
	this.website = "";
	this.logo = "";
	this.location = "";
};
Happening.COLLECTION = "iamgreek-events-collection";
Happening.COLLECTION_URL = iamgr.BASE_URL + "el/json-happenings";
Happening.create = function(json) {
	var happening = new Happening();
	happening.nodeId = json.nodeId;
	happening.location = NodeLocation.create(json);
	happening.title = json.title;
	happening.body = json.body;
	happening.date_start = json.date_start;
	happening.date_end = json.date_end;
	happening.website = json.website;
	happening.logo = json.logo;
	happening.eventtype = json.type;
	return happening;
};
Happening.createList = function(json) {
	var list = [];
	for ( var i in json.nodes) {
		var nodeId = json.nodes[i].node.nodeId;
		var node = Happening.create(json.nodes[i].node);
		list.push(node);
	}
	return list;
}
Happening.loadHappeningById = function(nodeId, callback) {
	for ( var i in iamgr.happeningsList) {
		var happening = iamgr.happeningsList[i];
		if(happening.nodeId==nodeId)
			return happening;
	}
};
Happening.loadAndShowList = function(refresh) {
	if (refresh) {
		localStorage.removeItem(Happening.COLLECTION);
	}
	Happening.loadHappeningsList(function(list) {
		iamgr.happeningsList = list;
		Happening.htmlHappeningsList(iamgr.happeningsList);
	});
};
Happening.loadHappeningsList = function(callback) {
	if (localStorage.getItem(Happening.COLLECTION)) {
		var nodes = eval(localStorage.getItem(Happening.COLLECTION));
		callback(nodes);
	} else {
		iamgr.loadingShow(true);
		var jqxhr = $.ajax(Happening.COLLECTION_URL).done(
				function(json) {
					var nodes = Happening.createList(json);
					if (json.nodes.length > 0)
						localStorage.setItem(Happening.COLLECTION, JSON
								.stringify(nodes));
					iamgr.loadingShow(false);
					callback(nodes);
				}).fail(function() {
			console.error("error loading data");
			iamgr.loadingShow(false);
		});
	}
};
Happening.htmlHappeningsList = function(happeningsList) {
	$("#happeningsDIV").empty();
	var ul = $("<ul />").attr("data-role", "listview").attr("data-filter",
			"true").attr("data-inset", true);
	for ( var i in happeningsList) {
		var happening = happeningsList[i];
		var li = $("<li />");
		var a = $("<a />")
		// .attr("href","#eventDetails?id="+happening.nodeId)
		.attr("data-iamgr-id", happening.nodeId);
		var h2 = $("<h2 />").append(happening.title);
		var p1 = $("<p />").append(happening.date_start);
		var p2 = NodeLocation.toHTMLElement(happening.location);
		a.append(h2);
		a.append(p1);
		a.append(p2);
		function changePage() {
			$.mobile.changePage($("#eventDetails"));
			return false;
		}
		a.on("click", function() {
			iamgr.id = $(this).attr("data-iamgr-id");
			var nodeId = iamgr.id;
			var happening = Happening.loadHappeningById(nodeId);
			var holder = $("#eventDetailsElement");
			holder.empty();
			Happening.htmlHappening(happening);
			changePage();
		});
		li.append(a);
		ul.append(li);
	}
	$("#happeningsDIV").append(ul);
	ul.listview();
};

Happening.htmlHappening = function(happening) {
	var holder = $("#eventDetailsElement");
	holder.empty();
	var title = $("<h2 />").html(happening.title);
	holder.append(title);
	var startDate = $("<p />").html("Εναρξη : " + happening.date_start);
	holder.append(startDate);
	if(happening.date_start !== happening.date_end && happening.date_end.length>0 )
	{
		var endDate = $("<p />").html("Λήξη : " + happening.date_end);
		holder.append(endDate);
	}
	var href = $("<a />")
		.attr("href", happening.logo)
		.attr("data-role","button")
		.attr("target","new")
		.append(happening.website)
		.button();
	var logoImg = $('<img style="width:120px" />').attr("src", happening.logo);
	var hrefLogo = $("<a />")
		.attr("data-enhance", false)
		.attr("target","new")
		.attr("href", happening.logo)
		.append(logoImg);
	holder.append('<h3>Τοποθεσία</h3>');
	holder.append("<p></p>").append(NodeLocation.toGoogleElement(happening.location));
	holder.append("<br />");
	holder.append(hrefLogo);
	holder.append(href);
    holder.append('<h3>Περιγραφή</h3>');
	holder.append(happening.body);
};
Happening.addToCalendar = function(happening){
	var startDate = new Date("November 17, 2013 10:00:00");
	var endDate = new Date("November 17, 2013 11:00:00");
	  var title = "My nice event";
	  var location = "Home";
	  var notes = "Some notes about this event.";
	  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
	  var error = function(message) { alert("Error: " + message); };

	  window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);

}
