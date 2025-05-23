import React, { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

function Box({ position, size, texturePath, fallbackColor }) {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} color={fallbackColor} />
    </mesh>
  );
}

function DimensionLine({ start, end, label }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  return (
    <>
      <line>
        <bufferGeometry attach="geometry" setFromPoints={points} />
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <Text
        position={[
          (start[0] + end[0]) / 2,
          start[1] + 5,
          (start[2] + end[2]) / 2,
        ]}
        fontSize={5}
        color="red"
      >
        {label}
      </Text>
    </>
  );
}

const ThreeDPreview = ({ blueprintData }) => {
  const WALL_THICKNESS = 10;
  const canvasRef = useRef();

  // Export button outside Canvas, receives scene as prop
  function ExportButton({ scene }) {
    const handleExport = () => {
      if (!scene) {
        alert('Scene not ready yet!');
        return;
      }
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const output = JSON.stringify(gltf, null, 2);
          const blob = new Blob([output], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'model.gltf';
          link.click();
        },
        { binary: false }
      );
    };

    return (
      <button
        onClick={handleExport}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          padding: '8px 12px',
          fontSize: 16,
          zIndex: 10,
          cursor: 'pointer',
        }}
      >
        Export GLTF
      </button>
    );
  }

  return (
    <div style={{ position: 'relative', width: 800, height: 600 }}>
      <Canvas
        shadows
        camera={{ position: [200, 200, 200], fov: 50 }}
        style={{ background: '#eaeaea' }}
        ref={canvasRef}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[100, 200, 100]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <OrbitControls />

        <gridHelper args={[400, 20]} />

        {blueprintData.map((item, i) => {
          const x = item.left + item.width / 2 - 200;
          const z = item.top + item.height / 2 - 150;

          let height = 20;
          let depth = WALL_THICKNESS;
          let texturePath = '';
          let fallbackColor = '#999999';

          if (item.type === 'room') {
            texturePath = '/textures/wall.jpg';
            height = 20;
            depth = WALL_THICKNESS;
            fallbackColor = '#999999';
          } else if (item.type === 'window') {
            texturePath = '/textures/window.png';
            height = 5;
            depth = 2;
            fallbackColor = '#3399ff';
          } else if (item.type === 'door') {
            texturePath = '/textures/door.jpg';
            height = 10;
            depth = 3;
            fallbackColor = '#cc6600';
          }

          return (
            <Box
              key={i}
              position={[x, height / 2, z]}
              size={[item.width, height, depth]}
              texturePath={texturePath}
              fallbackColor={fallbackColor}
            />
          );
        })}

        {blueprintData
          .filter((item) => item.type === 'room')
          .map((room, i) => (
            <DimensionLine
              key={i}
              start={[room.left - 200, 20, room.top - 150]}
              end={[room.left + room.width - 200, 20, room.top - 150]}
              label={`${Math.round(room.width)} units`}
            />
          ))}
      </Canvas>

      {/* Export button outside Canvas, pass scene from canvasRef */}
      <ExportButton scene={canvasRef.current?.scene} />
    </div>
  );
};

export default ThreeDPreview;
