window.app = {};
var sidebar = new ol.control.Sidebar({ element: 'sidebar', position: 'right' });

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(20);
var matrixIds = new Array(20);
var clickedCoordinate, populationLayer, gPopulation;
for (var z = 0; z < 20; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}

var baseLayer = new ol.layer.Tile({
    source: new ol.source.WMTS({
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        url: 'http://wmts.nlsc.gov.tw/wmts',
        layer: 'EMAP',
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true,
        attributions: '<a href="http://maps.nlsc.gov.tw/" target="_blank">國土測繪圖資服務雲</a>'
    }),
    opacity: 0.3
});

var appView = new ol.View({
  center: ol.proj.fromLonLat([120.221115, 22.964407]),
  zoom: 14
});

var map = new ol.Map({
  layers: [baseLayer],
  target: 'map',
  view: appView
});
map.addControl(sidebar);

var content = document.getElementById('sidebarContent');
map.on('singleclick', function(evt) {
  content.innerHTML = '';
  clickedCoordinate = evt.coordinate;

  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    var message = '';
    var p = feature.getProperties();
    for(k in p) {
      if(k !== 'geometry') {
        message += k + ': ' + p[k] + '<br />';
      }
    }

    content.innerHTML += message + '<hr />';
  });

  sidebar.open('home');
});