import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import './grid.css'
import MovingDot from '../pointer/moving_dot';
export default function GridControl() {
    const [width_container_count, set_width_count] = useState((window.innerWidth / 250) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / 250) + 1)
    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0
      });

    const control_style = {
        color: 'blue',
    };

    useEffect(() => {
        const handle_resize = () => {
            set_width_count((window.innerWidth / 250) + 1)
            set_height_count((window.innerHeight / 250) + 1)
        };
        window.addEventListener('resize', handle_resize);
        return () => window.removeEventListener('resize', handle_resize);
        // TODO Why does it return an empty array?
    }, [])

    return (
        <div className='grid_control' style={control_style}>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => (
                        <GridContainer key={col_index} />
                    ))}
                </div>
            ))}
        </div>
    );
}