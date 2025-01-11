function TestButton() {
    function handle_click() {
        alert('FAAAARRRRTTTT');
    }
    return (
        <button onClick={handle_click}>
            POOOOOOOOP
        </button>
    )
}

export default TestButton