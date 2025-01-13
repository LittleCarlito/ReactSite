export default function GridTile(is_active: boolean) {
  // TODO if is_active generate a random color from the enabled color map
  // TODO Take generated color and set background color to it
  const valid_colors: Array<String> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink']
    const rand_index = Math.floor(Math.random() * 100)
    const background_color = is_active ? valid_colors[rand_index] : 'transparent'
    return (
        <>
            <div className="tile" style = {{backgroundColor: `${background_color}`}}>
            </div>
        </>
    )
}


/*
Hover logic

import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
*/