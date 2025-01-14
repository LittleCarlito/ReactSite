import GridTile from './grid_tile'

// TODO update this function to take in x and y coordinate to know which of its tiles the mouse is over
export default function GridContainer() {
    const root = document.documentElement;
    const column_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_column_container_count'));
    const row_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_row_container_count'));
    return (
        <div className="grid_container">
            {Array.from({ length: column_size_property * row_size_property }).map((_, tile_index) => (
                <GridTile key={tile_index}/>
            ))}
        </div>
    )
}
