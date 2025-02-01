// Board.js
import React, { useState, useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";

export default function Board({ userId, boardId, elements, updateElements }) {
  // ===================
  // Local elements for movement changes
  // ===================
  const [localElements, setLocalElements] = useState(elements);

  // Whenever `elements` changes from outside (socket or otherwise), refresh local
  useEffect(() => {
    setLocalElements(elements);
  }, [elements]);

  // ===================
  // Zoom & Pan State
  // ===================
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // For panning the board
  const [isBoardDragging, setIsBoardDragging] = useState(false);
  const [boardDragStart, setBoardDragStart] = useState({ x: 0, y: 0 });

  // Selected element ID
  const [selectedId, setSelectedId] = useState(null);

  // Track whether we're resizing or rotating an element
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // For resizing
  const [resizeStart, setResizeStart] = useState({ mouseX: 0, mouseY: 0 });

  // For rotating
  const [rotationStart, setRotationStart] = useState({
    centerX: 0,
    centerY: 0,
    startAngle: 0,
  });

  // For element dragging
  const [isElementDragging, setIsElementDragging] = useState(false);
  const [elementDragStart, setElementDragStart] = useState({
    mouseX: 0,
    mouseY: 0,
    elX: 0,
    elY: 0,
  });

  // ======== TEXT EDITING STATE ========
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // ======== DRAWING STATE ========
  const [currentTool, setCurrentTool] = useState("none");
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [currentDraw, setCurrentDraw] = useState(null);
  const [drawElements, setDrawElements] = useState([]);

  // File input & container refs
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const drawingCanvasRef = useRef(null);

  // ===================
  // Prevent browser scrolling & custom wheel zoom
  // ===================
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const wheelHandler = (e) => {
      e.preventDefault();
      const direction = Math.sign(e.deltaY) * -1; // -1 => scroll up => zoom in
      const zoomFactor = 0.1;
      const newScale = Math.min(Math.max(0.5, scale + direction * zoomFactor), 3);

      // Calculate mouse position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const scaleChange = newScale / scale;

      setOffsetX((prev) => prev - (mouseX - prev) * (scaleChange - 1));
      setOffsetY((prev) => prev - (mouseY - prev) * (scaleChange - 1));
      setScale(newScale);
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener("wheel", wheelHandler, { passive: false });
    }

    return () => {
      document.body.style.overflow = "";
      if (containerEl) {
        containerEl.removeEventListener("wheel", wheelHandler, { passive: false });
      }
    };
  }, [scale, offsetX, offsetY]);

  // ===================
  // Initialize local drawElements from elements
  // (just the shapes that are drawings)
  // ===================
  useEffect(() => {
    const drawingTypes = ["pen", "eraser", "highlighter", "line", "rectangle", "circle"];
    const newDrawElements = localElements.filter((el) => drawingTypes.includes(el.type));
    setDrawElements(newDrawElements);
  }, [localElements]);

  // ===================
  // Board MouseDown => Possibly start panning; also deselect if empty
  // ===================
  const handleBoardMouseDown = (e) => {
    if (
      e.target === e.currentTarget &&
      !isResizing &&
      !isRotating &&
      currentTool === "none"
    ) {
      // Deselect everything
      setSelectedId(null);
      setEditingId(null);

      // Start board dragging
      setIsBoardDragging(true);
      setBoardDragStart({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    }
  };

  const handleBoardMouseMove = (e) => {
    if (isBoardDragging) {
      setOffsetX(e.clientX - boardDragStart.x);
      setOffsetY(e.clientY - boardDragStart.y);
      return;
    }
    if (isElementDragging) {
      handleElementDrag(e);
      return;
    }
    if (isResizing) {
      handleResizing(e);
      return;
    }
    if (isRotating) {
      handleRotating(e);
    }
  };

  // ===================
  // Board MouseUp => finalize localElements
  // ===================
  const handleBoardMouseUp = () => {
    setIsBoardDragging(false);
    setIsElementDragging(false);
    setIsResizing(false);
    setIsRotating(false);

    // Commit localElements to the server
    updateElements(localElements);
  };

  // ===================
  // Element Dragging
  // ===================
  const handleElementMouseDown = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);

    // If editing different text, close it
    if (editingId && editingId !== el.id) {
      setEditingId(null);
    }

    setIsElementDragging(true);
    setElementDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  const handleElementDrag = (e) => {
    // Update localElements only
    const dx = (e.clientX - elementDragStart.mouseX) / scale;
    const dy = (e.clientY - elementDragStart.mouseY) / scale;

    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;
        return { ...el, x: elementDragStart.elX + dx, y: elementDragStart.elY + dy };
      })
    );
  };

  // ===================
  // Resizing
  // ===================
  const handleMouseDownResize = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);
    setIsResizing(true);
    setIsElementDragging(false);
    setIsRotating(false);

    if (editingId && editingId !== el.id) {
      setEditingId(null);
    }

    setResizeStart({ mouseX: e.clientX, mouseY: e.clientY });
  };

  const handleResizing = (e) => {
    const dx = (e.clientX - resizeStart.mouseX) / scale;
    const dy = (e.clientY - resizeStart.mouseY) / scale;

    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;

        if (el.type === "image" && el.aspectRatio) {
          // Keep aspect ratio
          const newWidth = Math.max(el.width + dx, 20);
          const newHeight = newWidth / el.aspectRatio;
          return { ...el, width: newWidth, height: newHeight };
        } else if (el.type === "text") {
          const newWidth = Math.max(el.width + dx, 50);
          const newHeight = Math.max(el.height + dy, 30);
          return { ...el, width: newWidth, height: newHeight };
        } else {
          // For shapes (line, rectangle, circle)
          return { ...el, x2: el.x2 + dx, y2: el.y2 + dy };
        }
      })
    );

    setResizeStart({ mouseX: e.clientX, mouseY: e.clientY });
  };

  // ===================
  // Rotating
  // ===================
  const handleMouseDownRotate = (e, el) => {
    e.stopPropagation();
    setSelectedId(el.id);
    setIsRotating(true);
    setIsElementDragging(false);
    setIsResizing(false);
    setIsBoardDragging(false);

    if (editingId && editingId !== el.id) {
      setEditingId(null);
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;
    const dx = e.clientX - (containerRect.left + centerX * scale + offsetX);
    const dy = e.clientY - (containerRect.top + centerY * scale + offsetY);
    const startAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    setRotationStart({ centerX, centerY, startAngle });
  };

  const handleRotating = (e) => {
    const { centerX, centerY, startAngle } = rotationStart;
    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = (e.clientX - containerRect.left - offsetX) / scale;
    const currentY = (e.clientY - containerRect.top - offsetY) / scale;
    const dx = currentX - centerX;
    const dy = currentY - centerY;
    const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const delta = currentAngle - startAngle;

    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;
        const oldRotation = el.rotation || 0;
        return { ...el, rotation: oldRotation + delta };
      })
    );

    // Update rotation start angle
    setRotationStart({ centerX, centerY, startAngle: currentAngle });
  };

  // ===================
  // Add / Delete / Save
  // ===================
  const handleAddText = () => {
    const id = Date.now(); // or Date.now() + Math.random()
    const centerX = 600 - 100;
    const centerY = 400 - 25;

    const newText = {
      id,
      type: "text",
      x: centerX,
      y: centerY,
      width: 200,
      height: 50,
      content: "Double-click to edit me",
      rotation: 0,
      bgColor: "#ffffff",
      fontColor: "#000000",
      isBold: false,
      isItalic: false,
      fontSize: 16,
    };
    // Just update local
    setLocalElements((prev) => [...prev, newText]);
    setSelectedId(id);
  };

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageId = Date.now() + Math.random();
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const centerX = 600 - 100;
        const centerY = 400 - 75;

        const newImage = {
          id: imageId,
          type: "image",
          x: centerX,
          y: centerY,
          src: reader.result || "",
          width: 200,
          height: 200 / aspectRatio,
          rotation: 0,
          aspectRatio,
        };
        // local only
        setLocalElements((prev) => [...prev, newImage]);
        setSelectedId(imageId);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveJPG = () => {
    const triggerDownloadJPG = () => {
      const link = document.createElement("a");
      link.download = "board.jpg";
      link.href = combinedCanvas.toDataURL("image/jpeg", 0.95);
      link.click();
    };

    const exportScale = 2;
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = 1200 * exportScale;
    combinedCanvas.height = 800 * exportScale;
    const ctx = combinedCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    ctx.scale(exportScale, exportScale);

    const drawingCanvas = drawingCanvasRef.current;
    ctx.drawImage(drawingCanvas, 0, 0, drawingCanvas.width, drawingCanvas.height);

    let imagesLoaded = 0;
    const totalImages = localElements.filter((el) => el.type === "image").length;
    if (totalImages === 0) {
      triggerDownloadJPG();
    }

    localElements.forEach((el) => {
      if (el.type === "image") {
        if (!el.src) return;
        const img = new Image();
        img.src = el.src;
        img.onload = () => {
          ctx.save();
          ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
          ctx.rotate((el.rotation || 0) * (Math.PI / 180));
          ctx.drawImage(img, -el.width / 2, -el.height / 2, el.width, el.height);
          ctx.restore();
          imagesLoaded++;
          if (imagesLoaded === totalImages) triggerDownloadJPG();
        };
      } else if (el.type === "text") {
        ctx.save();
        ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
        ctx.rotate((el.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = el.bgColor || "#ffffff";
        ctx.fillRect(-el.width / 2, -el.height / 2, el.width, el.height);
        ctx.fillStyle = el.fontColor || "#000000";
        ctx.font = `${el.isBold ? "bold" : "normal"} ${
          el.isItalic ? "italic" : "normal"
        } ${el.fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.content, 0, 0);
        ctx.restore();
      }
    });

    if (totalImages === 0) {
      triggerDownloadJPG();
    }
  };

  const handleSave = () => {
    const triggerDownload = () => {
      const link = document.createElement("a");
      link.download = "board.png";
      link.href = combinedCanvas.toDataURL("image/png", 1.0);
      link.click();
    };

    const exportScale = 2;
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = 1200 * exportScale;
    combinedCanvas.height = 800 * exportScale;
    const ctx = combinedCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    ctx.scale(exportScale, exportScale);

    const drawingCanvas = drawingCanvasRef.current;
    ctx.drawImage(drawingCanvas, 0, 0, drawingCanvas.width, drawingCanvas.height);

    let imagesLoaded = 0;
    const totalImages = localElements.filter((el) => el.type === "image").length;
    if (totalImages === 0) {
      triggerDownload();
    }

    localElements.forEach((el) => {
      if (el.type === "image") {
        if (!el.src) return;
        const img = new Image();
        img.src = el.src;
        img.onload = () => {
          ctx.save();
          ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
          ctx.rotate((el.rotation || 0) * (Math.PI / 180));
          ctx.drawImage(img, -el.width / 2, -el.height / 2, el.width, el.height);
          ctx.restore();
          imagesLoaded++;
          if (imagesLoaded === totalImages) triggerDownload();
        };
      } else if (el.type === "text") {
        ctx.save();
        ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
        ctx.rotate((el.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = el.bgColor || "#ffffff";
        ctx.fillRect(-el.width / 2, -el.height / 2, el.width, el.height);
        ctx.fillStyle = el.fontColor || "#000000";
        ctx.font = `${el.isBold ? "bold" : "normal"} ${
          el.isItalic ? "italic" : "normal"
        } ${el.fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.content, 0, 0);
        ctx.restore();
      }
    });

    if (totalImages === 0) {
      triggerDownload();
    }
  };

  const handleDelete = () => {
    if (!selectedId) {
      alert("No element selected!");
      return;
    }
    setLocalElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);

    // We’ll finalize on mouse-up or you can commit immediately:
    // updateElements(localElementsAfterDelete)
  };

  // ===================
  // Text Editing
  // ===================
  const handleDoubleClickText = (el) => {
    setEditingId(el.id);
    setEditingContent(el.content);
  };

  const handleEditChange = (e) => {
    setEditingContent(e.target.value);
  };

  // Save text on blur or Enter
  const handleEditBlur = () => {
    // We'll commit text changes to localElements right away
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id !== editingId) return el;
        return { ...el, content: editingContent };
      })
    );
    setEditingId(null);

    // Wait for user to mouse-up to sync with server
    // or if you want immediate text sync, add:
    // updateElements(localElements);
  };

  const handleKeyDownInEdit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditBlur();
    }
  };

  // ===================
  // TEXT STYLE CHANGES
  // ===================

  const handleChangeBgColor = (e) => {
    const color = e.target.value;
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === "text") {
          return { ...el, bgColor: color };
        }
        return el;
      })
    );
  };

  const handleChangeFontColor = (e) => {
    const color = e.target.value;
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === "text") {
          return { ...el, fontColor: color };
        }
        return el;
      })
    );
  };

  const handleToggleBold = () => {
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === "text") {
          return { ...el, isBold: !el.isBold };
        }
        return el;
      })
    );
  };

  const handleToggleItalic = () => {
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === "text") {
          return { ...el, isItalic: !el.isItalic };
        }
        return el;
      })
    );
  };

  const handleChangeFontSize = (e) => {
    const size = parseInt(e.target.value, 10) || 16;
    setLocalElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === "text") {
          return { ...el, fontSize: size };
        }
        return el;
      })
    );
  };

  // ===================
  // Drawing Handlers
  // ===================
  useEffect(() => {
    const ctx = drawingCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);

    // Draw all completed "drawElements"
    drawElements.forEach((el) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (["pen", "eraser", "highlighter"].includes(el.type)) {
        ctx.beginPath();
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        ctx.globalAlpha = el.opacity;
        el.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (el.type === "line") {
        ctx.beginPath();
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
      } else if (el.type === "rectangle") {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        const rectX = Math.min(el.x1, el.x2);
        const rectY = Math.min(el.y1, el.y2);
        const w = Math.abs(el.x2 - el.x1);
        const h = Math.abs(el.y2 - el.y1);
        ctx.strokeRect(rectX, rectY, w, h);
      } else if (el.type === "circle") {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        const cx = (el.x1 + el.x2) / 2;
        const cy = (el.y1 + el.y2) / 2;
        const r = Math.sqrt((el.x2 - el.x1) ** 2 + (el.y2 - el.y1) ** 2) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw the current in-progress drawing
    if (currentDraw) {
      const el = currentDraw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (["pen", "eraser", "highlighter"].includes(el.type)) {
        ctx.beginPath();
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        ctx.globalAlpha = el.opacity;
        el.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (["line", "rectangle", "circle"].includes(el.type)) {
        ctx.beginPath();
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.lineWidth;
        if (el.type === "line") {
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x2, el.y2);
        } else if (el.type === "rectangle") {
          const rectX = Math.min(el.x1, el.x2);
          const rectY = Math.min(el.y1, el.y2);
          const w = Math.abs(el.x2 - el.x1);
          const h = Math.abs(el.y2 - el.y1);
          ctx.strokeRect(rectX, rectY, w, h);
        } else if (el.type === "circle") {
          const cx = (el.x1 + el.x2) / 2;
          const cy = (el.y1 + el.y2) / 2;
          const r = Math.sqrt((el.x2 - el.x1) ** 2 + (el.y2 - el.y1) ** 2) / 2;
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        }
        ctx.stroke();
      }
    }
  }, [drawElements, currentDraw]);

  const handleDrawingMouseDown = (e) => {
    if (currentTool === "none") return;

    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setIsDrawing(true);
    setDrawStart({ x, y });

    if (["pen", "eraser", "highlighter"].includes(currentTool)) {
      setCurrentDraw({
        type: currentTool,
        points: [{ x, y }],
        color:
          currentTool === "eraser"
            ? "#ffffff"
            : currentTool === "highlighter"
            ? drawingColor
            : drawingColor,
        lineWidth: brushSize,
        opacity: currentTool === "highlighter" ? 0.5 : 1,
      });
    } else if (["line", "rectangle", "circle"].includes(currentTool)) {
      setCurrentDraw({
        type: currentTool,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        color: drawingColor,
        lineWidth: brushSize,
      });
    }
  };

  const handleDrawingMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (["pen", "eraser", "highlighter"].includes(currentTool)) {
      setCurrentDraw((prev) => ({
        ...prev,
        points: [...prev.points, { x, y }],
      }));
    } else if (["line", "rectangle", "circle"].includes(currentTool)) {
      setCurrentDraw((prev) => ({ ...prev, x2: x, y2: y }));
    }
  };

  const handleDrawingMouseUp = () => {
    if (!isDrawing) return;

    if (["pen", "eraser", "highlighter"].includes(currentTool)) {
      const newElement = {
        type: currentTool,
        points: currentDraw.points,
        color: currentDraw.color,
        lineWidth: currentDraw.lineWidth,
        opacity: currentDraw.opacity,
      };
      setDrawElements((prev) => [...prev, newElement]);

      // Also merge into localElements immediately
      setLocalElements((prev) => [...prev, newElement]);
      // Then commit to the server (drawings typically safe to do here)
      updateElements([...localElements, newElement]);
    } else if (["line", "rectangle", "circle"].includes(currentTool)) {
      const { x1, y1, x2, y2, type, color, lineWidth } = currentDraw;
      const newElement = { type, x1, y1, x2, y2, color, lineWidth };
      setDrawElements((prev) => [...prev, newElement]);

      setLocalElements((prev) => [...prev, newElement]);
      updateElements([...localElements, newElement]);
    }

    setCurrentDraw(null);
    setIsDrawing(false);
  };

  // ===================
  // Toolbar Handlers
  // ===================
  const handleSelectTool = (tool) => {
    setCurrentTool(tool);
    setSelectedId(null);
    setEditingId(null);
  };

  const handleColorChange = (e) => {
    setDrawingColor(e.target.value);
  };

  const handleBrushSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size > 0) {
      setBrushSize(size);
    }
  };

  // ===================
  // Drag-and-Drop Handlers for Images
  // ===================
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const dropX = (e.clientX - rect.left) / scale;
    const dropY = (e.clientY - rect.top) / scale;

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!droppedFiles.length) return;

    droppedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageId = Date.now() + Math.random();
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newImage = {
            id: imageId,
            type: "image",
            src: reader.result || "",
            x: dropX,
            y: dropY,
            width: 200,
            height: 200 / aspectRatio,
            rotation: 0,
            aspectRatio,
          };
          setLocalElements((prev) => [...prev, newImage]);
          setSelectedId(imageId);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // ===================
  // Render
  // ===================
  const selectedElement = localElements.find((el) => el.id === selectedId);

  return (
    <div className="flex justify-center items-center bg-gray-100 w-screen h-screen">
      <div
        ref={containerRef}
        className="relative bg-white border border-gray-400 overflow-hidden"
        style={{ width: "1200px", height: "800px" }}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleBoardMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Buttons in top-left corner */}
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <button
            onClick={handleAddText}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Text
          </button>
          <button
            onClick={handleAddImage}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Image
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
          >
            Save as PNG
          </button>
          <button
            onClick={handleSaveJPG}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Save as JPG
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Selected
          </button>
        </div>

        {/* Toolbar for drawing tools */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 p-2 bg-gray-200 rounded">
          {/* Drawing Tool Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectTool("pen")}
              className={`px-3 py-1 rounded ${
                currentTool === "pen" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Pen
            </button>
            <button
              onClick={() => handleSelectTool("highlighter")}
              className={`px-3 py-1 rounded ${
                currentTool === "highlighter" ? "bg-yellow-300" : "bg-gray-300"
              } hover:bg-yellow-400`}
            >
              Highlighter
            </button>
            <button
              onClick={() => handleSelectTool("eraser")}
              className={`px-3 py-1 rounded ${
                currentTool === "eraser" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Eraser
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectTool("line")}
              className={`px-3 py-1 rounded ${
                currentTool === "line" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Line
            </button>
            <button
              onClick={() => handleSelectTool("rectangle")}
              className={`px-3 py-1 rounded ${
                currentTool === "rectangle" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Rectangle
            </button>
            <button
              onClick={() => handleSelectTool("circle")}
              className={`px-3 py-1 rounded ${
                currentTool === "circle" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Circle
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectTool("none")}
              className={`px-3 py-1 rounded ${
                currentTool === "none" ? "bg-gray-700 text-white" : "bg-gray-300"
              } hover:bg-gray-400`}
            >
              Select
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <label htmlFor="colorPicker" className="text-sm">
              Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={drawingColor}
              onChange={handleColorChange}
              className="border rounded"
            />
          </div>
          {/* Brush Size Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="brushSize" className="text-sm">
              Size:
            </label>
            <input
              id="brushSize"
              type="number"
              min="1"
              max="50"
              value={brushSize}
              onChange={handleBrushSizeChange}
              className="w-16 border rounded p-1"
            />
          </div>
        </div>

        {/* If the selected element is text, show style controls */}
        {selectedElement && selectedElement.type === "text" && (
          <div
            className="absolute top-16 left-2 z-10 p-2 rounded border border-gray-400 bg-gray-50 shadow"
            style={{ width: "330px" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm">BG:</label>
              <input
                type="color"
                value={selectedElement.bgColor || "#ffffff"}
                onChange={handleChangeBgColor}
              />
              <label className="text-sm">Font:</label>
              <input
                type="color"
                value={selectedElement.fontColor || "#000000"}
                onChange={handleChangeFontColor}
              />
            </div>

            {/* Bold / Italic toggles */}
            <div className="flex items-center gap-4 mb-2">
              <label className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={!!selectedElement.isBold}
                  onChange={handleToggleBold}
                />
                Bold
              </label>
              <label className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={!!selectedElement.isItalic}
                  onChange={handleToggleItalic}
                />
                Italic
              </label>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm">Font Size:</label>
              <input
                type="number"
                min="8"
                max="72"
                value={selectedElement.fontSize || 16}
                onChange={handleChangeFontSize}
                className="w-16 border p-1"
              />
            </div>
          </div>
        )}

        {/* Hidden file input for “Add Image” */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* “Canvas” for panning/zooming */}
        <div
          id="canvas-container"
          onMouseDown={handleBoardMouseDown}
          className="absolute border-2 border-dashed border-gray-300"
          style={{
            width: "1200px",
            height: "800px",
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Render only 'text' and 'image' elements from localElements */}
          {localElements
            .filter((el) => el.type === "text" || el.type === "image")
            .map((el) => {
              const isSelected = el.id === selectedId;
              const isEditingThis = el.id === editingId && el.type === "text";

              const textStyles = {
                backgroundColor: el.bgColor || "#fff",
                color: el.fontColor || "#000",
                fontWeight: el.isBold ? "bold" : "normal",
                fontStyle: el.isItalic ? "italic" : "normal",
                fontSize: el.fontSize ? `${el.fontSize}px` : "16px",
              };

              return (
                <div
                  key={el.id}
                  className="absolute"
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    transform: `rotate(${el.rotation || 0}deg)`,
                    transformOrigin: "center center",
                    border: isSelected ? "1px solid #00f" : "1px solid transparent",
                    cursor: isEditingThis ? "text" : "move",
                  }}
                  onMouseDown={(ev) => handleElementMouseDown(ev, el)}
                >
                  {el.type === "text" ? (
                    isEditingThis ? (
                      <textarea
                        style={{
                          width: "100%",
                          height: "100%",
                          boxSizing: "border-box",
                          resize: "none",
                          outline: "none",
                          border: "none",
                          ...textStyles,
                        }}
                        value={editingContent}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        onKeyDown={handleKeyDownInEdit}
                        autoFocus
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "5px",
                          boxSizing: "border-box",
                          overflow: "hidden",
                          ...textStyles,
                        }}
                        onDoubleClick={() => handleDoubleClickText(el)}
                      >
                        {el.content}
                      </div>
                    )
                  ) : (
                    // If it's an image
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: el.src ? `url(${el.src})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}

                  {/* If selected and type is image, show handles */}
                  {isSelected && !isEditingThis && el.type === "image" && (
                    <>
                      {/* Bottom-right resize handle */}
                      <div
                        onMouseDown={(event) => handleMouseDownResize(event, el)}
                        style={{
                          position: "absolute",
                          right: -6,
                          bottom: -6,
                          width: 12,
                          height: 12,
                          backgroundColor: "blue",
                          cursor: "se-resize",
                        }}
                      />
                      {/* Rotation handle (top-center) */}
                      <div
                        onMouseDown={(event) => handleMouseDownRotate(event, el)}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: -20,
                          transform: "translateX(-50%)",
                          width: 12,
                          height: 12,
                          backgroundColor: "orange",
                          cursor: "grab",
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })}

          {/* Drawing Canvas */}
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 z-30"
            width={1200}
            height={800}
            style={{
              width: "1200px",
              height: "800px",
              transformOrigin: "0 0",
              pointerEvents: currentTool !== "none" ? "auto" : "none",
            }}
            onMouseDown={handleDrawingMouseDown}
            onMouseMove={handleDrawingMouseMove}
            onMouseUp={handleDrawingMouseUp}
          />
        </div>
      </div>
    </div>
  );
}
