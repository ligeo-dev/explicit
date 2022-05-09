import {autoPosition} from './positionning';

export type SetupOptions = {
	// The element on which to setup explicit.
	container: HTMLElement;
	// An optional duration in ms to delay tooltips dismissal.
	// Keeping a small duration allows the user to jump from
	// an element to its tooltip if there is some space
	// between them.
	hideDelay: number;
};

const defaultOptions = {
	container: document.body,
	hideDelay: 200
};

export default (options: Partial<SetupOptions> = {}) => {
	const {container, hideDelay} = {...defaultOptions, ...options};

	let tooltipped: HTMLElement = null;
	let hideTimer: NodeJS.Timeout = null;

	const tooltip = document.createElement('p');
	tooltip.id = 'explicit-Tooltip';
	tooltip.className = 'explicit-Tooltip';
	tooltip.setAttribute('role', 'tooltip');

	const tooltipContainer = document.createElement('div');
	tooltipContainer.className = 'explicit-TooltipContainer';
	tooltipContainer.style.display = 'none';
	tooltipContainer.appendChild(tooltip);

	container.classList.add('explicit-Container');
	container.appendChild(tooltipContainer);

	const hide = () => {
		if (!tooltipped || !tooltipped.hasAttribute('data-explicit-title')) {
			return;
		}

		tooltipContainer.style.display = 'none';
		tooltipped.title = tooltipped.getAttribute('data-explicit-title');
		tooltipped.removeAttribute('data-explicit-title');
		tooltipped.removeAttribute('aria-describedby');
		tooltipped = null;
	};

	const show = (trigger: HTMLElement) => {
		clearTimeout(hideTimer);

		if (tooltip) {
			hide();
		}

		const title = trigger.getAttribute('title');

		if (!title) {
			return;
		}

		trigger.removeAttribute('title');
		trigger.setAttribute('aria-describedby', tooltip.id);
		trigger.setAttribute('data-explicit-title', title);
		tooltip.textContent = title;
		tooltipped = trigger;

		autoPosition(container, trigger, tooltipContainer);
		tooltipContainer.style.display = '';
	};

	const titledElement = (element: HTMLElement) => {
		if (!!element.getAttribute('title')) {
			return element;
		}

		const closest = element.closest(
			'[title], [data-explicit-title]'
		) as HTMLElement;

		return closest && container.contains(closest) ? closest : undefined;
	};

	const handleFocusIn = (trigger: HTMLElement) => {
		if (!container.contains(trigger)) {
			hide();
			return;
		}

		if (trigger === tooltipped || trigger === tooltip) {
			clearTimeout(hideTimer);
			return;
		}

		const element = titledElement(trigger);

		if (element) {
			show(element);
			return;
		}

		if (tooltipped && element !== tooltipped && element !== tooltip) {
			clearTimeout(hideTimer);
			hideTimer = setTimeout(hide, hideDelay);
		}
	};

	container.addEventListener('mouseover', ({target}) => {
		handleFocusIn(target as HTMLElement);
	});

	container.addEventListener('mouseleave', () => {
		hide();
	});

	document.addEventListener('focusin', ({target}) => {
		if (container.contains(target as HTMLElement)) {
			handleFocusIn(target as HTMLElement);
		} else {
			hide();
		}
	});

	document.addEventListener('keyup', ({key}) => {
		if (key === 'Escape') {
			hide();
		}
	});

	return {
		show,
		hide
	};
};
