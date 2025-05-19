// canvas/FabricCanvas.js
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function FabricCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("design-canvas", {
      width: 1200,
      height: 700,
      backgroundColor: "#fff",
      selection: true,
    });

    canvasRef.current = canvas;

    // --- Draw Grid ---
    const gridSize = 20;
    for (let i = 0; i < canvas.width / gridSize; i++) {
      canvas.add(
        new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
          stroke: "#eee",
          selectable: false,
          evented: false,
        })
      );
    }
    for (let i = 0; i < canvas.height / gridSize; i++) {
      canvas.add(
        new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
          stroke: "#eee",
          selectable: false,
          evented: false,
        })
      );
    }

    // --- Compass ---
    const compass = new fabric.Circle({
      radius: 20,
      fill: "#fff",
      stroke: "#000",
      left: 1100,
      top: 50,
      selectable: false,
      evented: false,
    });

    const hLine = new fabric.Line([1085, 70, 1115, 70], {
      stroke: "#000",
      selectable: false,
      evented: false,
    });

    const vLine = new fabric.Line([1100, 35, 1100, 65], {
      stroke: "#000",
      selectable: false,
      evented: false,
    });

    const compassGroup = new fabric.Group([compass, hLine, vLine], {
      selectable: false,
      evented: false,
    });

    canvas.add(compassGroup);

    // --- Panning & Zoom ---
    let isPanning = false;
    canvas.on("mouse:down", function (opt) {
      if (opt.e.altKey || opt.e.button === 1) {
        isPanning = true;
        canvas.setCursor("grab");
      }
    });

    canvas.on("mouse:move", function (opt) {
      if (isPanning) {
        const delta = new fabric.Point(opt.e.movementX, opt.e.movementY);
        canvas.relativePan(delta);
      }
    });

    canvas.on("mouse:up", () => {
      isPanning = false;
      canvas.setCursor("default");
    });

    canvas.on("mouse:wheel", function (opt) {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      zoom = Math.max(0.5, Math.min(2, zoom));
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    return () => canvas.dispose();
  }, []);

  // --- Rectangle Tool ---
  const addRectangle = () => {
    const canvas = canvasRef.current;
    const rect = new fabric.Rect({
      left: 200,
      top: 200,
      width: 100,
      height: 60,
      fill: "rgba(0, 0, 255, 0.3)",
      stroke: "blue",
      strokeWidth: 2,
    });
    canvas.add(rect);
  };

  return (
    <div style={{ display: "flex", border: "1px solid #ccc" }}>
      {/* Left Toolbar */}
      <div
        style={{
          width: "80px",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRight: "1px solid #ccc",
        }}
      >
        <button onClick={addRectangle} style={{ marginBottom: "10px" }}>
          ▭ 
        </button>
        {/* Add more buttons here later */}
      </div>

      {/* Canvas Area */}
      <div style={{ flex: 1 }}>
        <canvas id="design-canvas" />
      </div>
    </div>
  );
}
