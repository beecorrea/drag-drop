// Adaptation of https://www.kirupa.com/html5/drag.htm for multiple elements.
class Dragger {
  constructor(draggableClass, containerSelector) {
    // Inject selector for the listener container.
    this._containerSelector = containerSelector;
    // Inject class for the draggable items.
    this._draggableClass = draggableClass;
    // Container that wraps the draggables.
    this.container = null;

    // Flag to check if a drag is currently happening.
    this.shouldDrag = false;
    // The element that is being dragged.
    this.element = null;
    // The initial left/top DOM values (offsetLeft/offsetTop).
    this.x0 = null;
    this.y0 = null;
    // The initial mousedown event (x, y) coordinates.
    this.initialX = null;
    this.initialY = null;

    // Methods
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
    // Prevents from dragging container (should only drag child elements).
    if (!e.target.classList.contains(this._draggableClass)) return;

    const { target, offsetLeft, offsetTop } = e;
    // Sets the element that will be dragged.
    this.element = target;

    // No need to keep track of the values for each item.
    // The browser always has the latest left/top offsets.
    // But I guess it'd be useful if we're doing collaborative stuff.

    // Gets the initial left/top offset (x0/y0).
    this.x0 = offsetLeft;
    this.y0 = offsetTop;

    // Gets the initial place where the click happened.
    // This prevents snapping by calculating the deltaX/deltaY in drag().
    const { clientX, clientY } = e;
    this.initialX = clientX;
    this.initialY = clientY;

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
      // const center = (left, top);
      // Get drag position.
      const { clientX, clientY } = e;
      // let dragItem = this.items[this.dragItemId];

      // Calculate the amount of movement that happened between the initial mouse event position and the current drag.
      // Here we get the exact amount of movement that happened, instead of calculating it from the left position.
      // If this wasn't done, the left of the box would move to the pointer position (ooh, snapping).
      // const deltaX = clientX - dragItem.initialX;
      const deltaX = clientX - this.initialX;
      // const deltaY = clientY - dragItem.initialY;
      const deltaY = clientY - this.initialY;

      // Calculate the left offset from the initial mouse position.
      // This is the actual final movement value.
      // const distanceX = dragItem.x0 + deltaX;
      const distanceX = this.x0 + deltaX;
      // const distanceY = dragItem.y0 + deltaY;
      const distanceY = this.y0 + deltaY;

      // Update the item's current position.
      // This is the distance that the element moved (d_end - d_start).
      this.moveX(distanceX);
      this.moveY(distanceY);
    }
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

  /**
   *
   * Changes the translate property
   * @param {Number} x - the x coordinate to translate the element.
   * @param {Number} y - the x coordinate to translate the element.
   * @param {Node} el - the element that should be dragged.
   * @memberof Dragger
   */
  moveX(x) {
    // const el = this.items[this.dragItemId].element;
    const el = this.element;
    el.style.left = `${x}px`;
  }
  moveY(y) {
    // const el = this.items[this.dragItemId].element;
    const el = this.element;
    el.style.top = `${y}px`;
  }
}

const Drg = new Dragger('item', '#list-wrapper').init();
