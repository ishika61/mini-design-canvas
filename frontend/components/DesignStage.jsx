'use client';

import { useEffect, useRef } from 'react';
import { Circle, Layer, Rect, Stage, Text, Transformer } from 'react-konva';

export default function DesignStage({ elements, selectedId, onSelect, onChange, onStageReady }) {
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;
    const node = selectedId ? stage.findOne(`#${selectedId}`) : null;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer().batchDraw();
  }, [selectedId, elements]);

  useEffect(() => {
    if (stageRef.current) onStageReady(stageRef.current);
  }, [onStageReady]);

  const finishTransform = (element, node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const changes = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    if (element.type === 'circle') {
      changes.radius = Math.max(5, element.radius * Math.max(scaleX, scaleY));
    } else {
      changes.width = Math.max(10, node.width() * scaleX);
      changes.height = Math.max(10, node.height() * scaleY);
    }
    onChange(element.id, changes);
  };

  const sharedProps = (element) => ({
    id: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation || 0,
    fill: element.fill,
    draggable: true,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
    onDragEnd: (event) => onChange(element.id, { x: event.target.x(), y: event.target.y() }),
    onTransformEnd: (event) => finishTransform(element, event.target),
  });

  return (
    <div className="stage-wrap">
      <Stage
        ref={stageRef}
        width={900}
        height={600}
        onMouseDown={(event) => {
          if (event.target === event.target.getStage()) onSelect(null);
        }}
        onTouchStart={(event) => {
          if (event.target === event.target.getStage()) onSelect(null);
        }}
      >
        <Layer>
          <Rect width={900} height={600} fill="#ffffff" listening={false} />
          {elements.map((element) => {
            const props = sharedProps(element);
            if (element.type === 'circle') return <Circle key={element.id} {...props} radius={element.radius} />;
            if (element.type === 'text') {
              return <Text key={element.id} {...props} text={element.text || ''} fontSize={element.fontSize || 24} width={element.width || 220} height={element.height || 40} />;
            }
            return <Rect key={element.id} {...props} width={element.width} height={element.height} cornerRadius={4} />;
          })}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)}
          />
        </Layer>
      </Stage>
    </div>
  );
}
