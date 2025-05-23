import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const CanvasEditor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });

    // Add a rectangle as room
    const room = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#ddd',
      width: 300,
      height: 200,
      selectable: true,
    });
    canvas.add(room);

    // Add window group
    const windowRect = new fabric.Rect({
      width: 60,
      height: 20,
      fill: '#3399ff',
      originX: 'center',
      originY: 'center',
    });
    const windowText = new fabric.Text('Window', {
      fontSize: 12,
      originX: 'center',
      originY: 'center',
      fill: 'white',
    });
    const windowGroup = new fabric.Group([windowRect, windowText], {
      left: 200,
      top: 250,
      selectable: true,
    });
    canvas.add(windowGroup);

    // Add door group
    const doorRect = new fabric.Rect({
      width: 40,
      height: 80,
      fill: '#cc6600',
      originX: 'center',
      originY: 'center',
    });
    const doorText = new fabric.Text('Door', {
      fontSize: 12,
      originX: 'center',
      originY: 'center',
      fill: 'white',
    });
    const doorGroup = new fabric.Group([doorRect, doorText], {
      left: 400,
      top: 280,
      selectable: true,
    });
    canvas.add(doorGroup);

    // Save blueprint to localStorage on changes
    canvas.on('object:modified', saveBlueprint);
    canvas.on('object:added', saveBlueprint);
    canvas.on('object:removed', saveBlueprint);

    function saveBlueprint() {
      const json = canvas.toJSON();
      localStorage.setItem('blueprint', JSON.stringify(json));
    }

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CanvasEditor;
