export const filtraTarefa = () => {
    const filterList = document.getElementById('filter-list');

    const tasksCompleted = document.querySelector('[data-list]').querySelectorAll('.card--completed')
    const tasksPending = document.querySelector('[data-list]').querySelectorAll('.card--pending')   
    const tasksAll = document.querySelector('[data-list]').querySelectorAll('.card')
    
    filterList.querySelectorAll('button').forEach(element => {
        element.addEventListener('click', (event) => {
            if (event.target.classList.contains('bg-primary')) {

            }

            filterList.querySelectorAll('button').forEach(button => {
                event.target.classList.remove('bg-primary', 'bg-transparent-hover', 'text-white', 'text-primary', 'text-primary-hover', 'border-primary');
            });
            
            event.target.classList.add('bg-primary', 'bg-transparent-hover', 'text-white', 'text-primary-hover', 'border-primary');

            if (event.target.id === 'filterAll') {
                tasksAll.forEach(task => {
                    task.classList.remove('hide');
                });
            } else if (event.target.id === 'filterPending') {
                tasksCompleted.forEach(task => {
                    task.classList.add('hide');
                });
                tasksPending.forEach(task => {
                    task.classList.remove('hide');
                });
            } else if (event.target.id === 'filterCompleted') {
                tasksPending.forEach(task => {
                    task.classList.add('hide');
                });
                tasksCompleted.forEach(task => {
                    task.classList.remove('hide');
                });
            } else if (event.target.id === 'filterCompleted') {
                tasksPending.forEach(task => {
                    task.classList.add('hide');
                });
                tasksCompleted.forEach(task => {
                    task.classList.remove('hide');
                });
            }
        });
    });
}