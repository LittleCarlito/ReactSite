import './App.css'
import DefaultBase from './base/default_base'
import MovingDot from './overlay/pointer/moving_dot'

function App() {
  return (
    <>
      <div className='parent_container'>
        <div className='moving_dot'>
          <MovingDot />
        </div>
        <div className='default_background'>
          <DefaultBase />
        </div>
      </div>
    </>
  )
}

export default App
