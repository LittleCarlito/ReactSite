import { useState } from 'react';
import GridControl from "./grid/grid_control"
import './overlay.css'

export default function DotOverlay() {
    // Capturing mouse events here and sharing down to GridControl and MovingDot
    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0
      });
    
    return (
    <div className='overlay_container' onPointerMove={e => { set_position({ x: e.clientX, y: e.clientY }); }}>
        <div className='moving_dot'>
            {/* Disabling for now */}
            {/* <MovingDot x_position={position.x} y_position={position.y}/> */}
        </div>
        <div className='dot_grid'>
            <GridControl x_position={position.x} y_position={position.y}/>
        </div>
    </div>
    )
}