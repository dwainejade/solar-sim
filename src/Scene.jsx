import React, { useRef, useEffect, useState } from "react";
import { Stars, CameraControls } from "@react-three/drei";
import useStore, { usePlanetStore } from "./store/store";
import planetsData from "./data/planetsData";
import Planet from "./components/Planet";
import Moon from "./components/Moon";
import Sun from "./components/Sun";
// import { useThree } from "@react-three/fiber";
// import CameraController from "./components/CameraControls";

// scale down data for our model
const distanceScaleFactor = 0.0000001;
const sizeScaleFactor = 0.00015;
const rotationSpeedScaleFactor = 600000;

const Scene = () => {
  const { sunSettings } = useStore();
  const { planetPositions, selectedPlanet } = usePlanetStore();
  const cameraControlsRef = useRef();
  const [minDistance, setMinDistance] = useState(5);

  const resetCamera = () => {
    if (!cameraControlsRef.current) return;

    // Set the target to the sun's position
    cameraControlsRef.current.setTarget(sunSettings.position.x, sunSettings.position.y, sunSettings.position.z, true);

    // Define an isometric position for the camera
    const isometricPosition = {
      x: sunSettings.position.x + 30,
      y: sunSettings.position.y + 20,
      z: sunSettings.position.z + 40,
    };
    cameraControlsRef.current.setPosition(isometricPosition.x, isometricPosition.y, isometricPosition.z, true);
  };

  // Handle camera adjustments when a planet is selected
  useEffect(() => {
    if (selectedPlanet && cameraControlsRef.current) {
      const planetPosition = planetPositions[selectedPlanet.name];
      if (planetPosition) {
        // Assuming planet's position and other data are ready
        const scaledRadius = planetsData[selectedPlanet.name].radius * sizeScaleFactor;
        const optimalDistance = calculateOptimalDistance(scaledRadius);
        setMinDistance(optimalDistance / 2);
        cameraControlsRef.current.setTarget(planetPosition.x, planetPosition.y, planetPosition.z, true);
        cameraControlsRef.current.dollyTo(optimalDistance, true);
      }
      if (selectedPlanet.name === "Sun") {
        setMinDistance(4);
        cameraControlsRef.current.setTarget(0, 0, 0, true);
        cameraControlsRef.current.dollyTo(8, true);
      }
    }
  }, [selectedPlanet, planetPositions]);

  // Handle resetting the camera when no planet is selected
  useEffect(() => {
    if (!selectedPlanet && cameraControlsRef.current) {
      resetCamera();
    }
  }, [selectedPlanet, sunSettings.position]);

  // A simplistic approach to calculate optimal distance
  function calculateOptimalDistance(planetRadius) {
    // This is a simple heuristic. You might need a more complex calculation based on FOV and viewport size.
    const baseDistance = 4; // This depends on how large you want the planet to appear
    return planetRadius * baseDistance;
  }

  // const earthTextures = useTexture({
  //   map: "/assets/earth/2k_earth_daymap.jpg",
  //   normal: "/assets/earth/2k_earth_normal_map.png",
  //   specular: "/assets/earth/2k_earth_specular_map.png",
  // });
  // const jupiterTextures = useTexture({
  //   map: "/assets/jupiter/jupiter.png",
  // });
  // const venusTextures = useTexture({
  //   map: "/assets/venus/venus.png",
  // });
  // console.log(planetPositions);

  const cameraConfig = {
    maxDistance: 900,
    smoothTime: 0.5,
    truckSpeed: 2.0,
    rotateSpeed: 1.0,
    zoomSpeed: 1.0,
  };

  return (
    <>
      <CameraControls ref={cameraControlsRef} makeDefault {...cameraConfig} minDistance={minDistance} />
      <ambientLight intensity={0.2} />
      <pointLight color='#f6f3ea' intensity={1.2} position={[0, 0, 0]} />
      <Planet bodyData={planetsData.Earth} />
      {/* <Moon bodyData={planetsData.Moon} parentPosition={planetPositions.Earth} /> */}
      <Planet bodyData={planetsData.Mars} />
      <Planet bodyData={planetsData.Venus} />
      <Planet bodyData={planetsData.Mercury} />
      <Planet bodyData={planetsData.Jupiter} />
      <Planet bodyData={planetsData.Saturn} />
      <Planet bodyData={planetsData.Uranus} />
      <Planet bodyData={planetsData.Neptune} />
      {/* <Planet bodyData={planetsData.Pluto} /> */}
      <Sun position={sunSettings.position} resetCamera={resetCamera} />
      {/* <Ground /> */}
      <Stars radius={500} count={5000} factor={20} saturation={0} fade speed={0.5} />
    </>
  );
};

export default Scene;
