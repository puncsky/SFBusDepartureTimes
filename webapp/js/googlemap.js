'use strict';

var map;
var stopInfoWindow;
var centerMarker;
var initialPosition = new google.maps.LatLng(37.775242, -122.417594);
var initialZoom = 13;

function initialize() {
  var mapOptions = {
    zoom: initialZoom,
    center: initialPosition
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  centerMarker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    title: 'Click to show bus stops nearby...'
  });
  google.maps.event.addListener(map, 'center_changed', function() {
    window.setTimeout(function() {
      var center = map.getCenter();
      centerMarker.setPosition(center);
    }, 100);
  });
  google.maps.event.addListener(centerMarker, 'click', function() {
    showNearbyStops();
  });
}

function showNearbyStops() {
  var loc = centerMarker.getPosition();
  app.nearbyStops.fetch(loc.lat(), loc.lng());
}

function geolocate() {
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here...'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function locateToSF() {
  map.setCenter(initialPosition);
  map.setZoom(initialZoom);
}

function getStopMarker(stop, color) {
  var marker = new google.maps.Marker({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 2.5,
      strokeColor: color
    },
    position: new google.maps.LatLng(stop.lat || stop.loc[1], stop.lon || stop.loc[0]),
    title: stop.title
  });
  google.maps.event.addListener(marker, 'click', function() {
    app.aggregatedPredictions.fetch(stop.stopId);
    stopInfoWindow = stopInfoWindow || new google.maps.InfoWindow();
    stopInfoWindow.setContent(stop.title);
    stopInfoWindow.open(map, marker);
  });
  return marker;
}

function getStopMarkers(stops, color) {
  return stops.map(function(s) { return getStopMarker(s, color); });
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    zoom: 14,
    position: new google.maps.LatLng(37.775242, -122.417594),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function getRouteLines(route) {
  var path = route['path'];
  var lines = [];
  for (var i = 0; i < path.length; i++) {
    var points = path[i]['point'];
    var routeCoordinates = [];
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      routeCoordinates.push(
        new google.maps.LatLng(point['lat'], point['lon']));
    }
    var routeLine = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: '#' + route.color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    lines.push(routeLine);
  }
  return lines;
}

google.maps.event.addDomListener(window, 'load', initialize);