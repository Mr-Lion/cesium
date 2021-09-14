(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var map = undefined;
var createTheMap = function createTheMap() {
    if (map === undefined) {
        if (typeof Cesium === 'undefined') {
            return null;
        }
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWIzMGMwMi00MDNiLTQzZDctYTllYi0wMWY3ZmE0MzJiNGIiLCJpZCI6NjQ4NTcsImlhdCI6MTYyOTY3Nzg3NH0.ziXwlRzgqUht9q9hGlCY3fm3R9eNqHzy-kf7QWDneYk';
        map = new Cesium.Viewer('cesiumContainer', {
            sceneMode: Cesium.SceneMode.SCENE3D,
            baseLayerPicker: true,
            mapProjection: new Cesium.WebMercatorProjection(),
            timeline: true,
            animation: true,
            infoBox: true,
            navigationHelpButton: true,
            fullscreenButton: true,
            geocoder: true,
            shadows: true,
            homeButton: true
        });
        console.log(map);
    }
    map.scene.globe.enableLighting = true;
    map.scene.debugShowFramesPerSecond = true;
    map.extend(Cesium.viewerDragDropMixin, {});
    map.zoomTo(map.entities);
};
createTheMap();
if (map !== undefined) {}

},{}]},{},[1])

//# sourceMappingURL=main.bundle.js.map
