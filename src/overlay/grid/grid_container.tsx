import { useState, useEffect } from 'react';
import GridTile from './grid_tile'
import { ActiveData } from '../../types/active_data';

type GridContainerProps = {
    active_data?: ActiveData;
    column_count: number;
    row_count: number;
}

export default function GridContainer({active_data, column_count, row_count}: GridContainerProps) {
    const [active_id, set_active_id] = useState(-1)

    useEffect(() => {
        const x_position = active_data?.active_tile.active_column
        const y_position = active_data?.active_tile.active_row
        if(x_position != null && y_position != null) {
            if(x_position != -1 && y_position != -1) {
                set_active_id((y_position * column_count) + x_position)
            }
        }
        else {
            set_active_id(-1)
        }
    }, [active_data])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const is_active = tile_index == active_id;
                return(<GridTile key={tile_index} is_active={is_active}/>);
            })}
        </div>
    )
}
