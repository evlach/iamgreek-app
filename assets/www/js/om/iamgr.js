var iamgr = {
	BASE_URL : "http://i-am-greek.gr/",
	happeningsList : [],
	currrentHappening : null,
	user : {
		Geoposition : {
			coords : {
				accuracy : 41,
				altitude : null,
				altitudeAccuracy : null,
				heading : null,
				latitude : 50.746288899999996,
				longitude : 7.168766000000001,
				speed : null
			},
			timestamp : 1381012505836
		}
	}

};
iamgr.FILES_URL = iamgr.BASE_URL + "sites/default/files/";
iamgr.MAPS_URL = "https://maps.google.com/maps?q=";

iamgr.loadingShow = function(show) {
	if (show == undefined)
		show = true;
	var loadImg = $('<img class="iamgrLoader" src="img/ajax-loader.gif" />');
	$('.iamgrUserFeedback').find('.iamgrLoader').remove();
	if (show)
		$('.iamgrUserFeedback').append(loadImg);
};
iamgr.msg=function(msg){
	$('.iamgrUserFeedback').html(msg);
};
iamgr.exitApp=function()
{
   navigator.app.exitApp();
}

$(document).bind('mobileinit', function() {
	$.mobile.selectmenu.prototype.options.nativeMenu = false;
	$.mobile.selectmenu.prototype.options.hidePlaceholderMenuItems = false;
	$.mobile.loader.prototype.options.text = "loading";
	$.mobile.loader.prototype.options.textVisible = true;
	$.mobile.loader.prototype.options.theme = "b";
	$.mobile.loader.prototype.options.html = "";
	$.mobile.pushStateEnabled = false;
	$.mobile.ignoreContentEnabled = true;
	$.mobile.initializePage = false;
	
	// Navigation
    $.mobile.page.prototype.options.backBtnText = "Πίσω";
    $.mobile.page.prototype.options.addBackBtn      = true;
    $.mobile.page.prototype.options.backBtnTheme    = "b";

    // Page
    $.mobile.page.prototype.options.headerTheme = "c";  // Page header only
    $.mobile.page.prototype.options.contentTheme    = "b";
    $.mobile.page.prototype.options.footerTheme = "b";

    // Listviews
    $.mobile.listview.prototype.options.headerTheme = "b";  // Header for nested lists
    $.mobile.listview.prototype.options.theme           = "b";  // List items / content
    $.mobile.listview.prototype.options.dividerTheme    = "b";  // List divider

    $.mobile.listview.prototype.options.splitTheme   = "b";
    $.mobile.listview.prototype.options.countTheme   = "b";
    $.mobile.listview.prototype.options.filterTheme = "b";
    $.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
});
$(document).delegate("#events", "pagecreate", function() {
	$('.iamgrRefreshData').click(function(e) {
		Happening.loadAndShowList(true);
	});
	$('.iamgrCompaniesRefreshData').click(function(e) {
		Company.loadAndShowList(true);
	});
});
$(document).delegate("#eventDetails", "pagecreate", function() {
	$('.addToCalendar').click(function(e) {
		Happening.addToCalendar();
	});
});

$(document).delegate("#events", "pageshow", function() {
	Happening.loadAndShowList(false);
});
$(document).delegate("#eventDetails", "pageshow", function() {
/*	var nodeId = iamgr.id;
	Happening.loadHappeningById(nodeId, function(happening) {
		Happening.htmlHappening(happening);
	});*/
	
});

$(document).delegate("#allcompany", "pageshow", function() {
	Company.loadAndShowList(false);
});

navigator.geolocation.getCurrentPosition(function(pos) {
	iamgr.user.Geoposition = pos;
});