/**
 * Theme Name: Google Map places locator
 * Created with JetBrains PhpStorm.
 * Date: 17 May 2013
 * Version: 1.01
 * Author: Marsel Novy <marsel.novy@gmail.com>
 */
var map;
function initialize() {
    if (document.getElementById('location').value != '') {
        border('#E5E5E5');
        display('empty', 'none');
        display('map-canvas', 'block');
        display('more', 'block');
        remove_list();
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 17
        });
        var request = {
            query: document.getElementById('location').value
        };
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    }
    else {
        border('#FF0000');
    }
}
function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');
            moreButton.disabled = false;
            google.maps.event.addDomListenerOnce(moreButton, 'click',
                function () {
                    moreButton.disabled = true;
                    pagination.nextPage();
                });
        }
        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');
        for (var i = 0; i < 10; i++) {
            var place = results[i];
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });
            if (document.getElementById('view').value == 'List') {
                zindex(1, 0);
                placesList.innerHTML = placesList.innerHTML + '<li>' + place.name + ', ' + place.formatted_address + '</li>';
            }
            bounds.extend(place.geometry.location);
        }
        if (document.getElementById('view').value == 'Map') {
            zindex(0, 1);
            map.fitBounds(bounds);
        }
    }
}
function border(color) {
    var location = document.getElementById('location');
    location.style.border = '1px solid' + color;
}
function zindex(lz, mz) {
    var zindex = document.getElementById('list-canvas');
    zindex.style.zIndex = lz;
    zindex = document.getElementById('map-canvas');
    zindex.style.zIndex = mz;
}
function OnSearch(input) {    // Cancel button event
    if (input.value == "") {   //"You either clicked the X or you searched for nothing."
        remove_list();
        display('more', 'none');
        display('map-canvas', 'none');
        display('empty', 'block');
    } else {
    }  //"You searched for " + input.value
}
function display(element, visibility) {
    var more = document.getElementById(element);
    more.style.display = visibility;
}
function remove_list() {
    var body = document.getElementsByTagName('ul')[0];
    while (body.firstChild) body.removeChild(body.firstChild); // Remove old list of places
}
