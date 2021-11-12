AFRAME.registerComponent('gesture-detector', {
    schema: {
        element: { default: '' },
    },

    init() {
        this.targetElement =
            this.data.element && document.querySelector(this.data.element);

        if (!this.targetElement) {
            this.targetElement = this.el;
        }

        this.internalState = {
            previousState: null,
        };

        this.emitGestureEvent = this.emitGestureEvent.bind(this);

        this.targetElement.addEventListener('touchstart', this.emitGestureEvent);

        this.targetElement.addEventListener('touchend', this.emitGestureEvent);

        this.targetElement.addEventListener('touchmove', this.emitGestureEvent);
    },

    remove() {
        this.targetElement.removeEventListener('touchstart', this.emitGestureEvent);

        this.targetElement.removeEventListener('touchend', this.emitGestureEvent);

        this.targetElement.removeEventListener('touchmove', this.emitGestureEvent);
    },

    emitGestureEvent(event) {
        const currentState = this.getTouchState(event);

        const previousState = this.internalState.previousState;

        const gestureContinues =
            previousState &&
            currentState &&
            currentState.touchCount == previousState.touchCount;

        const gestureEnded = previousState && !gestureContinues;

        const gestureStarted = currentState && !gestureContinues;

        if (gestureEnded) {
            const eventName =
                `${this.getEventPrefix(previousState.touchCount)}fingerend`;

            this.el.emit(eventName, previousState);

            this.internalState.previousState = null;
        }

        if (gestureStarted) {
            currentState.startTime = performance.now();

            currentState.startPosition = currentState.position;

            currentState.startSpread = currentState.spread;

            const eventName =
                `${this.getEventPrefix(currentState.touchCount)}fingerstart`;

            this.el.emit(eventName, currentState);

            this.internalState.previousState = currentState;
