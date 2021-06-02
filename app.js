// Adaptation of https://www.kirupa.com/html5/drag.htm for multiple elements.

// The id of the current item being dragged.
let dragItemId;
// Flag to check if a drag is currently happening.
let shouldDrag = false;
// Store information of the items movements.
// The first time an item is dragged (i.e. mousedown), it is saved to memory.
// When it is dragged around or dropped, its position is updated on this variable.
let items = {};
// Counter for uuid.
let counter = 0;

function dragStart(e) {
  // Prevents from dragging container (should only drag elements).
  if (!e.target.classList.contains('item')) return;

  // Get the event target UUID.
  let { _uuid } = e.target;
  // Element wasn't dragged before, initialize it.
  if (_uuid == undefined) {
    // Set the target id.
    // Is this a bad practice?
    e.target._uuid = counter++;

    // Initialize the memory for the element's position.
    items[e.target._uuid] = { element: e.target };

    // Initialize the movements offsets.
    items[e.target._uuid].endX = 0;
    items[e.target._uuid].endY = 0;
  }

  // Sets the element's id to identify the current dragged item.
  dragItemId = e.target._uuid;
  // Get the mousedown event position on the client screen.
  const { clientX, clientY } = e;
  // Set the start of the movement to the current position minus the screen offset from the screen
  // In future iterations, this subtraction is done so the subtraction in drag() still accounts for
  // the previous movement.  If not, the movements would not be "cumulative", and every new drag
  // would translate the element from its original render position. This happens because we move
  // the element by changing its transform property. We're not "actually" moving the element between positions.
  items[dragItemId].initialX = clientX - items[dragItemId].endX;
  items[dragItemId].initialY = clientY - items[dragItemId].endY;
  shouldDrag = true;
}

function drag(e) {
  if (shouldDrag) {
    e.preventDefault();

    // Get drag position.
    const { clientX, clientY } = e;
    let dragItem = items[dragItemId];
    // Update the item's current position.
    // This is the distance that the element moved (d_end - d_start).
    dragItem.endX = clientX - dragItem.initialX;
    dragItem.endY = clientY - dragItem.initialY;
    // Move the item.
    move(dragItem.endX, dragItem.endY, dragItem.element);
  }
}

function dragEnd(e) {
  if (shouldDrag) {
    // End the movement.
    shouldDrag = false;
  }
}

function move(x, y, el) {
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

const container = document.querySelector('#list-wrapper');
container.addEventListener('mousedown', dragStart);
container.addEventListener('mouseup', dragEnd);
container.addEventListener('mousemove', drag);
