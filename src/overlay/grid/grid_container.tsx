import { useState, useEffect } from 'react';
import GridTile from './grid_tile'

type GridContainerProps = {
    x_position?: number;
    y_position?: number;
    tile_size: number;
    column_count: number;
    row_count: number;
}

export default function GridContainer({x_position, y_position, tile_size, column_count, row_count}: GridContainerProps) {
    const [active_id, set_active_id] = useState(-1)

    useEffect(() => {
        if(x_position != null && y_position != null) {
            if (x_position != -1 && y_position != -1) {
                const active_row = Math.trunc(y_position / tile_size)
                const active_column = Math.trunc(x_position / tile_size)
                set_active_id((((active_row) * column_count) + (active_column)))
            }
        }
        else {
            set_active_id(-1)
        }
    }, [x_position, y_position])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const is_active = tile_index == active_id;
                return(<GridTile key={tile_index} is_active={is_active}/>);
            })}
        </div>
    )
}
