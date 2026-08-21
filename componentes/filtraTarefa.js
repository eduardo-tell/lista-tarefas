export const filtraTarefa = () => {
    const filterList = document.getElementById('filter-list');
    const taskList = document.querySelector('[data-list]');
    const activeClass = 'btn bg-primary bg-transparent-hover text-white text-primary-hover border-primary';
    const defaultClass = 'btn border-primary text-primary text-white-hover bg-primary-hover';
    let activeFilter = null;

    const applyFilter = () => {
        const tasks = taskList.querySelectorAll('.card--completed, .card--pending');

        tasks.forEach(task => {
            const isVisible = !activeFilter || task.classList.contains(`card--${activeFilter}`);
            task.classList.toggle('d-none', !isVisible);
        });
    };

    const observer = new MutationObserver(applyFilter);
    observer.observe(taskList, { childList: true, subtree: true });

    filterList.querySelectorAll('basic-button').forEach(element => {
        element.addEventListener('click', (event) => {
            const filter = event.currentTarget.id === 'filterPending' ? 'pending' : 'completed';
            const isActive = event.currentTarget._button.className === activeClass;

            if (isActive) {
                event.currentTarget._button.className = defaultClass;
                activeFilter = null;
            } else {
                filterList.querySelectorAll('basic-button').forEach(button => {
                    button._button.className = defaultClass;
                });
                
                event.currentTarget._button.className = activeClass;
                activeFilter = filter;
            }

            applyFilter();
        });
    });
};