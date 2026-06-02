export const filtraTarefa = () => {
    const filterList = document.getElementById('filter-list');

    const tasksCompleted = document.querySelector('[data-list]').querySelectorAll('.card--completed')
    const tasksPending = document.querySelector('[data-list]').querySelectorAll('.card--pending')   
    const tasksAll = document.querySelector('[data-list]').querySelectorAll('.card')
    
    filterList.querySelectorAll('button').forEach(element => {
        element.addEventListener('click', (event) => {

            filterList.querySelectorAll('button').forEach(button => {
                button.classList.remove('active');
            });
            
            event.target.classList.add('active');

            console.log(event.target.id);
            
            
            if (event.target.id === 'filterAll') {
                tasksAll.forEach(task => {
                    task.classList.remove('hide');
                });
            }else if (event.target.id === 'filterPending') {
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