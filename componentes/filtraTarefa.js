export const filtraTarefa = () => {
    console.log('filtraTarefa')

    const filterList = document.getElementById('filter-list');

    const tasksCompleted = document.querySelector('[data-list]').querySelectorAll('ul li div.card--completed');
    const tasksPending = document.querySelector('[data-list]').querySelectorAll('ul li div.card--pending');   
    const tasksAll = document.querySelector('[data-list]').querySelectorAll('ul li div');

    filterList.querySelectorAll('basic-button').forEach(element => {
        console.log(tasksCompleted)

        element.addEventListener('click', (event) => {
            filterList.querySelectorAll('basic-button').forEach(button => {
                button._button.className = 'btn border-primary text-primary text-white-hover bg-primary-hover';
            });
            
            event.currentTarget._button.className = 'btn bg-primary bg-transparent-hover text-white text-primary-hover border-primary';

            if (event.currentTarget.id === 'filterAll') {
                tasksAll.forEach(task => {
                    task.classList.remove('d-none');
                });
            } else if (event.currentTarget.id === 'filterPending') {
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
        });
    });
}