export interface GameState {
    /**
     * Invoked on each game loop iteration, when this state is set as the active state
     *
     * @param dt Seconds since last update
     */
    update(dt: number): any
}