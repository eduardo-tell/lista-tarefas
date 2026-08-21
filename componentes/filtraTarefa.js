export const filtraTarefa = () => {
    console.log('filtraTarefa')

    const filterList = document.getElementById('filter-list');

    const tasksCompleted = document.querySelector('[data-list]').querySelectorAll('ul li div.card--completed');
    const tasksPending = document.querySelector('[data-list]').querySelectorAll('ul li div.card--pending');   
    const tasksAll = document.querySelector('[data-list]').querySelectorAll('ul li div');
    let activeClass = 'btn bg-primary bg-transparent-hover text-white text-primary-hover border-primary'
    let defaultClass = 'btn border-primary text-primary text-white-hover bg-primary-hover';

    filterList.querySelectorAll('basic-button').forEach(element => {
        element.addEventListener('click', (event) => {
            if (event.currentTarget._button.className === activeClass) {
                event.currentTarget._button.className = defaultClass;
                clearFilter();
            } else {
                filterList.querySelectorAll('basic-button').forEach(button => {
                    button._button.className = defaultClass;
                });
                
                event.currentTarget._button.className = activeClass;

                if (event.currentTarget.id === 'filterPending') {
                    tasksCompleted.forEach(task => {
                        task.classList.add('d-none');
                    });
                    tasksPending.forEach(task => {
                        task.classList.remove('d-none');
                    });
                } else if (event.currentTarget.id === 'filterCompleted') {
                    tasksPending.forEach(task => {
                        task.classList.add('d-none');
                    });
                    tasksCompleted.forEach(task => {
                        task.classList.remove('d-none');
                    });
                } else if (event.currentTarget.id === 'filterCompleted') {
                    tasksPending.forEach(task => {
                        task.classList.add('d-none');
                    });
                    tasksCompleted.forEach(task => {
                        task.classList.remove('d-none');
                    });
                }
            }

            function clearFilter() {
                tasksAll.forEach(task => {
                    task.classList.remove('d-none');
                });
            };
        });
    });
}