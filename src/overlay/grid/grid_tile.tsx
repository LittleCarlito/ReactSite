import { useState, useEffect } from "react";

interface GridTIleProps {
  is_active?: boolean;
}

export default function GridTile({ is_active }: GridTIleProps) {
  const [background_color, set_background_color] = useState('transparent')

  useEffect(() => {
    const valid_colors: Array<string> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink']
    const rand_index = Math.floor(Math.random() * valid_colors.length)
    set_background_color(valid_colors[rand_index])
  }, [is_active])


  return (
    <>
      <div className="tile" style = {{backgroundColor: `${background_color}`}}>
      </div>
    </>
  )
}
