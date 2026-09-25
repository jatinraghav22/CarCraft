document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.app-sidebar');
    const toggle = document.querySelector('[data-sidebar-toggle]');
    const scrim = document.querySelector('.sidebar-scrim');

    if (!sidebar || !toggle || !scrim) {
        return;
    }

    const closeSidebar = () => {
        sidebar.classList.remove('is-open');
        scrim.classList.remove('is-visible');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('is-open');
        scrim.classList.toggle('is-visible', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    scrim.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });
});
