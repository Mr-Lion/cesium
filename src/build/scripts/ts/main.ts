import * as bootstrap from 'bootstrap';
import * as Cesium from 'cesium';

let map: Cesium.Viewer = undefined;

// let sandcastle: Sandcastle = undefined;

const createTheMap = () => {
    if (map === undefined) {

        if (typeof Cesium === 'undefined') {
            return null;
        }

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWIzMGMwMi00MDNiLTQzZDctYTllYi0wMWY3ZmE0MzJiNGIiLCJpZCI6NjQ4NTcsImlhdCI6MTYyOTY3Nzg3NH0.ziXwlRzgqUht9q9hGlCY3fm3R9eNqHzy-kf7QWDneYk';

        map = new Cesium.Viewer('cesiumContainer',
            {
                //Start in Columbus Viewer
                sceneMode: Cesium.SceneMode.SCENE3D,

                //Use Cesium World Terrain
                // terrainProvider: Cesium.createWorldTerrain(),

                //Hide the base layer picker
                baseLayerPicker: true,

                // imageryProvider: new Cesium.TileMapServiceImageryProvider({
                //   url: Cesium.buildModuleUrl("Assets/Textures/BingMapsAerial"),
                // }),

                // Show Columbus View map with Web Mercator projection
                mapProjection: new Cesium.WebMercatorProjection(),


                timeline: true,
                animation: true,
                infoBox: true,
                navigationHelpButton: true,
                fullscreenButton: true,
                geocoder: true,
                shadows: true,

                homeButton: true,

            });

        console.log(map);

    }

    map.scene.globe.enableLighting = true;
    map.scene.debugShowFramesPerSecond = true;

    //Add basic drag and drop functionality
    map.extend(Cesium.viewerDragDropMixin, {});

    map.zoomTo(map.entities);
};

createTheMap();

if (map !== undefined) {
    var wyoming = map.entities.add({
        name: 'Wyoming',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -109.080842, 45.002073,
                -105.91517, 45.002073,
                -104.058488, 44.996596,
                -104.053011, 43.002989,
                -104.053011, 41.003906,
                -105.728954, 40.998429,
                -107.919731, 41.003906,
                -109.04798, 40.998429,
                -111.047063, 40.998429,
                -111.047063, 42.000709,
                -111.047063, 44.476286,
                -111.05254, 45.002073]),
            height: 0,
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });

    // map.zoomTo(wyoming);
    // Add Cesium OSM Buildings, a global 3D buildings layer.

    const buildingTileset = map.scene.primitives.add(
        Cesium.createOsmBuildings()
    );

    // Fly the camera to San Francisco at the given longitude, latitude, and height.

    // map.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    //     orientation: {
    //         heading: Cesium.Math.toRadians(0.0),
    //         pitch: Cesium.Math.toRadians(-15.0),
    //     }
    // });
}

// const options = {
//   camera: map.scene.camera,
//   canvas: map.scene.canvas,
// };

// sandcastle.addToolbarMenu(
//   [
//     {
//       text: "KML - Global Science Facilities",
//       onselect: function () {
//         map.camera.flyHome(0);
//         map.dataSources.add(
//           Cesium.KmlDataSource.load(
//             "../SampleData/kml/facilities/facilities.kml",
//             options
//           )
//         );
//       },
//     },
//     {
//       text: "KMZ with embedded data - GDP per capita",
//       onselect: function () {
//         map.camera.flyHome(0);
//         map.dataSources.add(
//           Cesium.KmlDataSource.load(
//             "../SampleData/kml/gdpPerCapita2008.kmz",
//             options
//           )
//         );
//       },
//     },
//     {
//       text: "gx KML extensions - Bike Ride",
//       onselect: function () {
//         map.dataSources
//           .add(
//             Cesium.KmlDataSource.load(
//               "../SampleData/kml/bikeRide.kml",
//               options
//             )
//           )
//           .then(function (dataSource) {
//             map.clock.shouldAnimate = false;
//             var rider = dataSource.entities.getById("tour");
//             map.flyTo(rider).then(function () {
//               map.trackedEntity = rider;
//               map.selectedEntity = map.trackedEntity;
//               map.clock.multiplier = 30;
//               map.clock.shouldAnimate = true;
//             });
//           });
//       },
//     },
//   ],
//   "toolbar"
// );

// sandcastle.reset = function () {
//   map.dataSources.removeAll();
//   map.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
//   map.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
// };



