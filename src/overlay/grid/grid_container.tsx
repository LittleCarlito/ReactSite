import { useState, useEffect } from 'react';
import GridTile from './grid_tile'

type GridContainerProps = {
    x_position?: number;
    y_position?: number;
    column_count: number;
    row_count: number;
}

export default function GridContainer({x_position, y_position, column_count, row_count}: GridContainerProps) {
    const [is_active, set_active] = useState(false)
    useEffect(() => {
        if((x_position != null && x_position != 0) && (y_position != null && y_position != 0)) {
            set_active(true)
        }
        // TODO Implment determining which tile the mouse is over and activating only that one
    }, [x_position, y_position])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const additional_props = is_active ? {is_active: true} : {};
                return(<GridTile key={tile_index} {...additional_props}/>);
            })}
        </div>
    )
}
