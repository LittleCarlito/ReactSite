import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import './grid.css'

type GridControlProps = {
    x_position: number;
    y_position: number;
}

export default function GridControl( {x_position, y_position}: GridControlProps ) {
    // TODO Translate those to what containers are active and pass them the x and y info
    //        Those containers should then let the proper panels know to light up
    //           Panels shoudl have logic when lit up to select random background color

    // Get the value of a CSS variables
    const root = document.documentElement;
    const tile_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_tile_size'));
    const column_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_column_container_count'));
    const row_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_row_container_count'));

    const container_width: number = tile_size_property * column_count_property
    const container_height: number = tile_size_property * row_count_property
    const [width_container_count, set_width_count] = useState((window.innerWidth / container_width) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / container_height) + 1)

    useEffect(() => {
        const handle_resize = () => {
            set_width_count((window.innerWidth / container_width) + 1);
            set_height_count((window.innerHeight / container_height) + 1);
        };
        window.addEventListener('resize', handle_resize);
        return () => window.removeEventListener('resize', handle_resize);
    }, [])

    const [active_coordinates, set_active_coordinates] = useState<{ column: number; column_remainder: number; row: number; row_remainder: number}>({
        column: -1,
        column_remainder: -1,
        row: -1,
        row_remainder: -1
    });
    // TODO Based off given x and y params calculate which GridContainer in the matrix contains the active tile
    useEffect(() => {
        // Determine active column
        let active_column: number = Math.trunc(x_position / container_width);
        const column_remainder: number = x_position % container_width;
        // Determine active row
        let active_row: number = Math.trunc(y_position / container_height);
        const row_remainder: number = y_position % container_height;
        // Set active coordinates for rendering
        set_active_coordinates({ column: active_column, column_remainder: column_remainder, 
                                    row: active_row, row_remainder: row_remainder })
    }, [x_position, y_position])

    // TODO Add in grid container to see if col_index and row_index match coordinates, if they do pass in x and y remainders
    return (
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        const additional_props =
                            (row_index === active_coordinates.row && col_index === active_coordinates.column)
                            ? {x_position: active_coordinates.column_remainder, y_position: active_coordinates.row_remainder}
                            : {};
                    return(
                        <GridContainer 
                            key={col_index} 
                            tile_size={tile_size_property}
                            column_count={column_count_property} 
                            row_count={row_count_property} 
                            {... additional_props}
                        />
                    );
                    })}
                </div>
            ))}
        </div>
    );
}