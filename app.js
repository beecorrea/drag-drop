// Adaptation of https://www.kirupa.com/html5/drag.htm for multiple elements.
class Dragger {
  constructor(draggableClass, containerSelector) {
    // Inject selector for the listener container.
    this._containerSelector = containerSelector;
    // Inject class for the draggable items.
    this._draggableClass = draggableClass;

    // The id of the current item being dragged.
    this.dragItemId = null;
    // Flag to check if a drag is currently happening.
    this.shouldDrag = false;
    // Store information of the items movements.
    // The first time an item is dragged (i.e. mousedown), it is saved to memory.
    // When it is dragged around or dropped, its position is updated on this variable.
    this.items = {};
    // Counter for uuid.
    this.counter = 0;
    this.container = null;
    this.init = this.init.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.moveX = this.moveX.bind(this);
    this.moveY = this.moveY.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  /**
   *
   * Initializes the event listeners.
   * @memberof Dragger
   */
  init() {
    this.container = document.querySelector(this._containerSelector);
    this.container.addEventListener('mousedown', this.dragStart);
    this.container.addEventListener('mousemove', this.drag);
    this.container.addEventListener('mouseup', this.dragEnd);
  }

  /**
   *
   * Handles the dragging start. Sets up initial values for the movement
   * and registers the draggable item if it's the first time.
   * @memberof Dragger
   */
  dragStart(e) {
    // Prevents from dragging container (should only drag elements).
    if (!e.target.classList.contains(this._draggableClass)) return;

    // Get the event target UUID.
    let { _uuid } = e.target;
    // Element wasn't dragged before, initialize it.
    if (_uuid == undefined) {
      // Set the target id.
      // Is this a bad practice?
      e.target._uuid = this.counter++;

      // Initialize the memory for the element's position.
      this.items[e.target._uuid] = { element: e.target };

      // Initialize the movements offsets.
      // this.items[e.target._uuid].endX = 0;
      // this.items[e.target._uuid].endY = 0;
    }

    // Sets the element's id to identify the current dragged item.
    this.dragItemId = e.target._uuid;
    // Get the mousedown event position on the client screen.
    const { clientX, clientY } = e;
    // Set the start of the movement to the current position minus the screen offset from the screen.
    // In future iterations, this subtraction is done so the subtraction in drag() still accounts for
    // the previous movement.  If not, the movements would not be "cumulative", and every new drag
    // would translate the element from its original render position. This happens because we move
    // the element by changing its transform property. We're not "actually" moving the element between positions.
    // this.items[this.dragItemId].initialX = clientX; // - this.items[this.dragItemId].endX;
    // this.items[this.dragItemId].initialY = clientY; // - this.items[this.dragItemId].endY;
    this.shouldDrag = true;
  }

  /**
   *
   * Moves the element whenever the mouse is pressed down and the pointer moves.
   * @param {MouseEvent} e
   * @memberof Dragger
   */
  drag(e) {
    if (this.shouldDrag) {
      e.preventDefault();

      // Get drag position.
      const { clientX, clientY } = e;
      let dragItem = this.items[this.dragItemId];
      // Update the item's current position.
      // This is the distance that the element moved (d_end - d_start).
      this.moveX(clientX - clientX / 6);
      this.moveY(clientY - clientY / 6);
    }
  }

  /**
   *
   * Changes the translate property
   * @param {Number} x - the x coordinate to translate the element.
   * @param {Number} y - the x coordinate to translate the element.
   * @param {Node} el - the element that should be dragged.
   * @memberof Dragger
   */
  moveX(x) {
    const el = this.items[this.dragItemId].element;
    el.style.left = `${x}px`;
    el.style.right = `${x}px`;
  }
  moveY(y) {
    const el = this.items[this.dragItemId].element;
    el.style.top = `${y}px`;
  }

  /**
   *
   * Stops dragging shit around.
   * @param {MouseEvent} e
   * @memberof Dragger
   */
  dragEnd(e) {
    if (this.shouldDrag) {
      // End the movement.
      this.shouldDrag = false;
    }
  }
}

const Drg = new Dragger('item', '#list-wrapper').init();
