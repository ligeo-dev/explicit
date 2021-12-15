import setup from './setup';

const containers = Array.from(
	document.querySelectorAll<HTMLElement>('[data-explicit-container]')
);

if (!containers.length) {
	containers.push(document.body);
}

containers.forEach((container) => {
	const hideDelay = parseInt(
		container.getAttribute('data-explicit-delay'),
		10
	);

	setup({
		container,
		hideDelay: isNaN(hideDelay) ? undefined : hideDelay
	});
});
