export enum Axes {
	horizontal = 'horizontal',
	vertical = 'vertical'
}

export type Bounds = [number, number];

const relativePosition = (containerRect: DOMRect, rect: DOMRect) => ({
	top: rect.top - containerRect.top,
	left: rect.left - containerRect.left
});

const mainAxisBounds = (
	elementStart: number,
	elementSize: number,
	containerSize: number
): Bounds => {
	const center = elementStart + elementSize / 2;
	return center < containerSize / 2
		? [elementStart + elementSize, 0]
		: [0, containerSize - elementStart];
};

const crossAxisBounds = (
	elementStart: number,
	elementSize: number,
	containerSize: number
): Bounds => {
	const center = elementStart + elementSize / 2;
	const size = Math.min(center, containerSize - center) * 2;
	return center < containerSize / 2
		? [0, containerSize - size]
		: [containerSize - size, 0];
};

export const position = (
	containerRect: DOMRect,
	triggerRect: DOMRect,
	target: HTMLElement,
	axis: Axes
) => {
	const {top, left} = relativePosition(containerRect, triggerRect);
	const [horizontalRect, verticalRect] =
		axis === Axes.horizontal
			? [mainAxisBounds, crossAxisBounds]
			: [crossAxisBounds, mainAxisBounds];

	const [l, r] = horizontalRect(left, triggerRect.width, containerRect.width);
	const [t, b] = verticalRect(top, triggerRect.height, containerRect.height);

	target.style.top = `${t}px`;
	target.style.right = `${r}px`;
	target.style.bottom = `${b}px`;
	target.style.left = `${l}px`;

	if (axis === Axes.horizontal) {
		target.style.justifyContent = l < r ? 'flex-end' : 'flex-start';
		target.style.alignItems = 'center';
	} else {
		target.style.justifyContent = 'center';
		target.style.alignItems = t < b ? 'flex-end' : 'flex-start';
	}
};

export const autoPosition = (
	container: HTMLElement,
	trigger: HTMLElement,
	target: HTMLElement
) => {
	const containerRect = container.getBoundingClientRect();
	const triggerRect = trigger.getBoundingClientRect();
	const {top, left} = relativePosition(containerRect, triggerRect);
	const horizontalCenter = left + triggerRect.width / 2;
	const horizontalRatio = horizontalCenter / containerRect.width;
	const closestHorizontalBound = Math.min(
		horizontalRatio,
		1 - horizontalRatio
	);

	const verticalCenter = top + triggerRect.height / 2;
	const verticalRatio = verticalCenter / containerRect.height;
	const closestVerticalBound = Math.min(verticalRatio, 1 - verticalRatio);
	const isMainAxisHorizontal = closestHorizontalBound < closestVerticalBound;

	position(
		containerRect,
		triggerRect,
		target,
		isMainAxisHorizontal ? Axes.horizontal : Axes.vertical
	);
};
