import { useState, useEffect } from 'react';
import GridTile from './grid_tile'
import { ActiveData } from '../../types';
import { calculate_id } from '../../utils';

type GridContainerProps = {
    active_data?: ActiveData;
    column_count: number;
    row_count: number;
}

export default function GridContainer({active_data, column_count, row_count}: GridContainerProps) {
    const [active_id, set_active_id] = useState<number>(-1);
    const [primary_ids, set_primary_ids] = useState<Array<number>>([]);
    const [secondary_ids, set_secondary_ids] = useState<Array<number>>([]);
    const [tertiary_ids, set_tertiary_ids] = useState<Array<number>>([]);

    useEffect(() => {
        // Check active data for active tile 
        const x_position = active_data?.active_tile?.tile_column;
        const y_position = active_data?.active_tile?.tile_row;
        if(x_position != null && y_position != null) {
            if(x_position !== -1 && y_position !== -1) {
                const calculated_active_id: number = calculate_id(y_position, x_position, column_count);
                // console.log(`Setting ${calculated_active_id} as active as a result of ${y_position} and ${x_position} coordinates`)
                set_active_id(calculated_active_id);
            }
        } 
        else {
            set_active_id(-1);
        }
        // Check active data for primary tiles
        if(active_data?.primary_tiles) {
            const new_primary_ids: Array<number> = active_data.primary_tiles
            .map(tc => {
                const primary_id: number = calculate_id(tc.tile_row, tc.tile_column, column_count);
                // console.log(`Setting ${primary_id} as primary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return primary_id;
            });
            set_primary_ids(new_primary_ids);
        } 
        else {
            set_primary_ids([]);
        }
        // Check active data for secondary tiles
        if(active_data?.secondary_tiles) {
            const new_secondary_ids: Array<number> = active_data.secondary_tiles
            .map(tc => {
                const secondary_id: number = calculate_id(tc.tile_row, tc.tile_column, column_count);
                // console.log(`Setting ${secondary_id} as secondary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return secondary_id;
            });
            set_secondary_ids(new_secondary_ids);
        } else {
            set_secondary_ids([]);
        }
        // Check active data for tertiary tiles
        if(active_data?.tertiary_tiles) {
            const new_tertiary_ids: Array<number> = active_data.tertiary_tiles
            .map(tc => {
                const tertiary_id: number = calculate_id(tc.tile_row, tc.tile_column, column_count);
                // console.log(`Setting ${tertiary_id} as secondary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return tertiary_id;
            });
            set_tertiary_ids(new_tertiary_ids);
        } else {
            set_tertiary_ids([]);
        }
    }, [active_data])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const is_active = tile_index == active_id;
                const is_primary = primary_ids.includes(tile_index);
                const is_secondary = secondary_ids.includes(tile_index);
                const is_tertiary = tertiary_ids.includes(tile_index);
                return(
                    <GridTile 
                        key={tile_index} 
                        is_active={is_active} 
                        is_primary={is_primary}
                        is_secondary={is_secondary}
                        is_tertiary={is_tertiary}
                    />);
            })}
        </div>
    )
}
