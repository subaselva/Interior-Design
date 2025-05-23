import React, { useState, useEffect } from "react";
import FabricCanvas from "./canvas/FabricCanvas";
import CanvasEditor from './canvas/CanvasEditor';
import ThreeDPreview from './canvas/ThreeDPreview';

function App() {
  const [blueprintData, setBlueprintData] = useState([]);
  const [view3D, setView3D] = useState(false);

  useEffect(() => {
    const json = localStorage.getItem('blueprint');
    if (json) {
      const fabricData = JSON.parse(json);
      const shapes = [];

      fabricData.objects.forEach(obj => {
        if (obj.type === 'rect') {
          shapes.push({
            type: 'room',
            left: obj.left,
            top: obj.top,
            width: obj.width * obj.scaleX,
            height: obj.height * obj.scaleY,
          });
        } else if (obj.type === 'group') {
          const texts = obj.objects.filter(o => o.type === 'text');
          const label = texts.length > 0 ? texts[0].text.toLowerCase() : '';
          const rect = obj.objects.find(o => o.type === 'rect');
          if (rect) {
            shapes.push({
              type: label.includes('window')
                ? 'window'
                : label.includes('door')
                ? 'door'
                : 'unknown',
              left: obj.left,
              top: obj.top,
              width: rect.width * rect.scaleX,
              height: rect.height * rect.scaleY,
            });
          }
        }
      });

      setBlueprintData(shapes);
    }
  }, [view3D]);
  return (
    <div style={{ padding: 20 }}>
      <h2>Interior Design Blueprint</h2>
     
      <button onClick={() => setView3D(!view3D)}>
        Switch to {view3D ? '2D Editor' : '3D Preview'}
      </button>
     <div style={{ marginTop: 20 }}>
  {view3D ? (
    blueprintData.length > 0 ? (
      <ThreeDPreview key="3d" blueprintData={blueprintData} />
    ) : (
      <p key="no-blueprint">No blueprint loaded. Save your 2D design first.</p>
    )
  ) : (
    <CanvasEditor key="2d" />
  )}


      </div>
    </div>
  );
}

export default App;
