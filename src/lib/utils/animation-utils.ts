// src/lib/utils/animation-utils.ts
// Animation-related utility functions

/**
 * Sets up an animation interval that toggles a boolean state at specified intervals
 * @param stateGetter Function that returns the current state
 * @param stateSetter Function that sets the new state value
 * @param interval Interval in milliseconds between toggles
 * @returns Cleanup function to clear the interval
 */
export function setupToggleInterval(
    stateGetter: () => boolean, 
    stateSetter: (value: boolean) => void,
    interval: number = 5000
): () => void {
    const toggleInterval = setInterval(() => {
        stateSetter(!stateGetter());
    }, interval);
    
    return () => clearInterval(toggleInterval);
}

/**
 * Sets up a slideshow interval that cycles through slides
 * @param currentSlideGetter Function that returns the current slide index
 * @param slideSetter Function that sets the new slide index
 * @param totalSlides Total number of slides to cycle through
 * @param interval Interval in milliseconds between slides
 * @returns Cleanup function to clear the interval
 */
export function setupSlideshowInterval(
    currentSlideGetter: () => number,
    slideSetter: (value: number) => void,
    totalSlides: number,
    interval: number = 5000
): () => void {
    const slideInterval = setInterval(() => {
        slideSetter((currentSlideGetter() + 1) % totalSlides);
    }, interval);
    
    return () => clearInterval(slideInterval);
}

/**
 * Creates a temporary animation effect and then reverts
 * @param stateSetter Function that sets the animation state
 * @param duration Duration in milliseconds before reverting
 */
export function triggerTemporaryAnimation(
    stateSetter: (value: boolean) => void,
    duration: number = 1000
): void {
    stateSetter(true);
    setTimeout(() => {
        stateSetter(false);
    }, duration);
}

/**
 * Generates a CSS transform style for a carousel slide
 * @param index The index of the carousel item
 * @param stepDegrees Degrees of rotation between steps
 * @param translation Distance to translate on Z-axis
 * @param isSelected Whether this is the selected item
 * @param factor Scaling factor for selected items (usually > 1)
 * @returns CSS transform string
 */
export function getCarouselItemTransform(
    index: number,
    stepDegrees: number,
    translation: number,
    isSelected: boolean = false,
    factor: number = 1.1
): string {
    const zTranslation = (isSelected ? factor : 1) * translation;
    return `rotateY(${index * stepDegrees}deg) translateZ(${zTranslation}px)`;
}

/**
 * Calculates carousel transformation values
 * @param carouselWidth Width of the carousel container
 * @param stepDegrees Degrees between each carousel item
 * @returns Translation distance for z-axis
 */
export function calculateCarouselTranslation(
    carouselWidth: number,
    stepDegrees: number
): number {
    return 0.5 * carouselWidth / Math.tan((0.5 * stepDegrees) * (Math.PI / 180));
}