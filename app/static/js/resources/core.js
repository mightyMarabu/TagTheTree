var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container
});

var expandedAttribution = new ol.control.Attribution({
    collapsible: false
});

var map = new ol.Map({
    controls: ol.control.defaults({attribution:false}).extend([
        expandedAttribution
    ]),
    target: document.getElementById('map'),
    renderer: 'canvas',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
         maxZoom: 28, minZoom: 1
    })
});

var layerSwitcher = new ol.control.LayerSwitcher({tipLabel: "Layers"});
map.addControl(layerSwitcher);
layerSwitcher.hidePanel = function() {};
layerSwitcher.showPanel();

map.on("singleclick", (e) => {
    console.log("clicked");
    var xy = ol.proj.transform(e.coordinate, "EPSG:3857", "EPSG:4326");
    var radius = parseFloat($("#radius").val());
    console.log(xy[0], xy[1]);
    console.log(radius);
    $.getJSON({
        url: `/save/${xy[0]}/${xy[1]}/${radius}`,
        success: data => {
            console.log(data);
            location.reload();
        }
    }).error(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    });
});


map.getView().fit([2200000, 200000, 6200000, 800000], map.getSize());
var NO_POPUP = 0
var ALL_FIELDS = 1
