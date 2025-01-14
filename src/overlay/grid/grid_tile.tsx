import { useState, useEffect, useRef } from "react";

interface GridTIleProps {
  is_active?: boolean;
}

export default function GridTile({ is_active }: GridTIleProps) {
  const is_frist_render = useRef(true);
  const [background_color, set_background_color] = useState('transparent');

  useEffect(() => {
    if(is_frist_render.current) {
      is_frist_render.current = false;
      return;
    }
    if(is_active) {
      const valid_colors: Array<string> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink'];
      const rand_index = Math.floor(Math.random() * valid_colors.length);
      set_background_color(valid_colors[rand_index]);
    }
    else {
      set_background_color('transparent')
    }
  }, [(is_active)]);


  return (
    <>
      <div className="tile" style = {{backgroundColor: `${background_color}`}}>
      </div>
    </>
  )
}
