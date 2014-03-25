function Company() {  
	this.nodeId = 0;
	this.body="";
	this.title = "default";
	this.location = new NodeLocation();
	this.website = "";
	this.type = "";
	this.products = [];
	this.phone="";
	this.open = "";
	this.logo = "";
};
Company.MODEL = "iamgreek-companies";
Company.MODEL_COLLECTION = "iamgreek-companies-collection";
Company.MODEL_URL = iamgr.BASE_URL + "services/node/";
Company.COLLECTION_URL = iamgr.BASE_URL + "el/json-companies";
Company.create = function (json){
	var company = new Company();
	company.nodeId = json.nodeId;
	company.location = NodeLocation.create(json);
	company.title = json.title;
	company.website = json.website;
	company.type = json.type;
	company.phone = json.phone;
	company.open = json.open;
	company.logo = json.logo;
	return company;
};
Company.createList = function(json) {
	var list = [];
	for ( var i in json.nodes) {
		var nodeId = json.nodes[i].node.nodeId;
		var node = Company.create(json.nodes[i].node);
		list.push(node);
	}
	return list;
}
Company.loadById = function(nodeId, callback) {
	for ( var i in iamgr.companiesList) {
		var company = iamgr.companiesList[i];
		if(company.nodeId==nodeId)
			return company;
	}
};
Company.loadAndShowList = function (refresh)
{
	if(refresh)
	{
		localStorage.removeItem(Company.MODEL_COLLECTION);		
		localStorage.removeItem(Company.MODEL);		
	}
	 Company.loadEntitiesList(function(list){
		iamgr.companiesList = list;	
		Company.htmlEntitiesList(list);
	 });
};
Company.loadEntitiesList = function (callback)
{
	if(localStorage.getItem(Company.MODEL_COLLECTION))
	{
		var nodes = JSON.parse(localStorage.getItem(Company.MODEL_COLLECTION));
		callback(nodes);
	}
	else
	{
		iamgr.loadingShow(true);
		var jqxhr = $.ajax(Company.COLLECTION_URL)
		  .done(function(json) {	
			  var nodes = Company.createList(json);
			  if(nodes.length>0)
					localStorage.setItem(Company.MODEL_COLLECTION,JSON.stringify(nodes));			  
			  iamgr.loadingShow(false);
			  callback(nodes);
		  })
		  .fail(function() {
			  console.error("error loading data");
			  iamgr.loadingShow(false);
		  });		
	}
};
Company.htmlEntitiesList = function (entitiesList)
{
	$("#companiesDIV").empty();
	var ul = $("<ul />")
		.attr("data-role","listview")
		.attr("data-filter","true")
		.attr("data-inset",true);
	for (var i = 0; i < entitiesList.length; i++) {
		var company = entitiesList[i];
		var li = $("<li />");
		var a = $("<a />")
			.attr("data-iamgr-id",company.nodeId);
		var h2 = $("<h2 />").append(company.title);
		var p2 = NodeLocation.toHTMLElement(company.location);
		a.append(h2);
		a.append(p2);
		function changePage() {
            $.mobile.changePage($("#companyDetails"));
            return false;
        }
		a.on("click",function() {
			iamgr.id = $(this).attr("data-iamgr-id");
			var nodeId = iamgr.id;
			var company = Company.loadById(nodeId);
			var holder = $("#companyDetailsElement");
			holder.empty();
			Company.toHTML(company);
			changePage();
		});
		li.append(a);
		ul.append(li);
	}
	$("#companiesDIV").append(ul);
	ul.listview();
};
Company.toHTML = function(company) {
	var holder = $("#companyDetailsElement");
	holder.empty();
	var title = $("<h2 />").html(company.title);
	holder.append(title);	
	var href = $("<a />")
		.attr("href", company.website)
		.attr("data-role","button")
		.attr("data-mini","true")
		.attr("target","new")
		.append(company.website)
		.button();
	var logoImg = $('<img style="width:120px" />').attr("src", company.logo);
	var hrefLogo = $("<a />")
		.attr("data-enhance", false)
		.attr("target","new")
		.attr("href", company.logo)
		.append(logoImg);
	holder.append('<h3>Τοποθεσία</h3>');
	holder.append("<p></p>").append(NodeLocation.toGoogleElement(company.location));
	holder.append("<br />");
	holder.append(hrefLogo);
	holder.append(href);
	holder.append('<h3>Ωράριο λειτουργίας</h3>');
	holder.append(company.open);
	holder.append('<h3>Τηλέφωνο</h3>');
	holder.append(company.phone);
    holder.append('<h3>Περιγραφή</h3>');
	holder.append(company.body);
};
