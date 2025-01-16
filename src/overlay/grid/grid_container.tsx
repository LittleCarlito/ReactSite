import { useState, useEffect } from 'react';
import GridTile from './grid_tile'
import { ActiveData } from '../../types/active_data';
import { TileCoordinate } from '../../types';

type GridContainerProps = {
    active_data?: ActiveData;
    column_count: number;
    row_count: number;
}

export default function GridContainer({active_data, column_count, row_count}: GridContainerProps) {
    const [active_id, set_active_id] = useState<number>(-1)
    const [primary_ids, set_primary_ids] = useState<Array<number>>([])

    useEffect(() => {
        set_primary_ids([])
        // Check active data for active tile 
        const x_position = active_data?.active_tile?.tile_column;
        const y_position = active_data?.active_tile?.tile_row;
        if(x_position != null && y_position != null) {
            if(x_position !== -1 && y_position !== -1) {
                const calculated_active_id: number = (y_position * column_count) + x_position
                console.log(`Setting ${calculated_active_id} as active as a result of ${y_position} and ${x_position} coordinates`)
                set_active_id(calculated_active_id);
            }
        } else {
            set_active_id(-1)
        }
        // Check active data for primary tiles
        if(active_data?.primary_tiles) {
            const container_primaries: Array<TileCoordinate> = active_data.primary_tiles;
            console.log(`I recieved ${container_primaries.length} primary tiles`);
            const new_primary_ids = container_primaries
            .map(tc => {
                const primary_id: number = (tc.tile_row * column_count) + tc.tile_column;
                console.log(`Setting ${primary_id} as primary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return primary_id
            });
            set_primary_ids(new_primary_ids)
        } else {
            set_primary_ids([])
        }
    }, [active_data])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const is_active = tile_index == active_id;
                const is_primary = primary_ids.includes(tile_index)
                if(is_primary){
                    console.log(`${tile_index} is primary`)
                }
                return(
                    <GridTile 
                        key={tile_index} 
                        is_active={is_active} 
                        is_primary={is_primary
                    }/>);
            })}
        </div>
    )
}
