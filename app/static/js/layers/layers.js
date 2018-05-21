var wms_layers = [];
var baseLayer = new ol.layer.Group({
    'title': '',
    layers: [
new ol.layer.Tile({
    'title': 'OSM',
    'type': 'base',
    source: new ol.source.OSM()
})
]
});
/*****WMS-Layer****************************************************************************** */

var lyrSites = new ol.layer.Tile({
  source: new ol.source.TileWMS(({
    url: "http://163.172.133.143:32780/geoserver/landbook/wms?",
attributions: [new ol.Attribution({html: '<a href=""></a>'})],
    params: {
      "LAYERS": "reg_point",
      "TILED": "true",
      "VERSION": "1.3.0"},
  })),
  title: "requested Sites",
  opacity: 1.000000,
  
  
});
wms_layers.push([lyrSites, 0]);


var lyrSoilKenya = new ol.layer.Tile({
  source: new ol.source.TileWMS(({
    url: "http://163.172.133.143:32780/geoserver/landbook/wms?",
attributions: [new ol.Attribution({html: '<a href=""></a>'})],
    params: {
      "LAYERS": "soil_sotwis_ken",
      "TILED": "true",
      "VERSION": "1.3.0"},
  })),
  title: "Soil Kenya",
  opacity: 1.000000,
  
  
});
wms_layers.push([lyrSoilKenya, 0]);


var lyrProtectedAreas = new ol.layer.Tile({
                            source: new ol.source.TileWMS(({
                              url: "http://163.172.133.143:32780/geoserver/landbook/wms?",
    attributions: [new ol.Attribution({html: '<a href=""></a>'})],
                              params: {
                                "LAYERS": "wdpa_eastafrica",
                                "TILED": "true",
                                "VERSION": "1.3.0"},
                            })),
                            title: "protected Areas",
                            opacity: 1.000000,
                            
                            
                          });
              wms_layers.push([lyrProtectedAreas, 0]);

var lyrArea_result_1 = new ol.layer.Tile({
                            source: new ol.source.TileWMS(({
                              url: "http://163.172.133.143:32780/geoserver/landbook/wms?",
    attributions: [new ol.Attribution({html: '<a href=""></a>'})],
                              params: {
                                "LAYERS": "result_areas",
                                "TILED": "true",
                                "VERSION": "1.3.0"},
                            })),
                            title: "reached Areas",
                            opacity: 1.000000,
                            
                            
                          });
              wms_layers.push([lyrArea_result_1, 0]);

var lyrArea_result_2 = new ol.layer.Tile({
                source: new ol.source.TileWMS(({
                  url: "http://163.172.133.143:32780/geoserver/landbook/wms?",
attributions: [new ol.Attribution({html: '<a href=""></a>'})],
                  params: {
                    "LAYERS": "result_soil",
                    "TILED": "true",
                    "VERSION": "1.3.0"},
                })),
                title: "Soil",
                opacity: 1.000000,
                
                
              });
  wms_layers.push([lyrArea_result_2, 0]);              

/*
var lyrSumArea_result_2 = new ol.layer.Tile({
                source: new ol.source.TileWMS(({
                  url: "http://192.168.70.134:32769/geoserver/France/wms?",
attributions: [new ol.Attribution({html: '<a href=""></a>'})],
                  params: {
                    "LAYERS": "sumAreas_result",
                    "TILED": "true",
                    "VERSION": "1.3.0"},
                })),
                title: "Total Area",
                opacity: 1.000000,
                
                
              });
  wms_layers.push([lyrSumArea_result_2, 0]);

            

var lyrBuffer_result_3 = new ol.layer.Tile({
                source: new ol.source.TileWMS(({
                  url: "http://192.168.70.134:32769/geoserver/France/wms?",
attributions: [new ol.Attribution({html: '<a href=""></a>'})],
                  params: {
                    "LAYERS": "buffer_result",
                    "TILED": "true",
                    "VERSION": "1.3.0"},
                })),
                title: "Radius",
                opacity: 1.000000,
                
                
              });
  wms_layers.push([lyrBuffer_result_3, 0]);
*/
  /********************WFS*****************
  var vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function(extent) {
      return 'http://192.168.70.134:32769/geoserver/France/ows?service=WFS&'+//'http://192.168.70.134:32769/geoserver/France/WFS&' +
          'version=1.1.0&request=GetFeature&typename=France:reg_point' +
          'outputFormat=application/json&srsname=EPSG:3857&' +
          'bbox=' + extent.join(',') + ',EPSG:3857';
    },
    strategy: ol.loadingstrategy.bbox
  });


  var vector = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 2
      })
    })
  });
*/

lyrSites.setVisible(true);lyrSoilKenya.setVisible(false);lyrProtectedAreas.setVisible(false);lyrArea_result_1.setVisible(true);lyrArea_result_2.setVisible(true);
//lyrSumArea_result_2.setVisible(false);lyrBuffer_result_3.setVisible(true);vector.setVisible(true);

var layersList = [baseLayer,lyrSoilKenya,lyrProtectedAreas,lyrArea_result_1,lyrArea_result_2,lyrSites,];
