export const garantirIds = (tarefas) => {
    let alterou = false;
    const comId = tarefas.map((tarefa) => {
        if (tarefa.id) return tarefa;
        alterou = true;
        return { ...tarefa, id: crypto.randomUUID() };
    });

    if (alterou) {
        localStorage.setItem('tarefas', JSON.stringify(comId));
    }

    return comId;
}

export const removeDatasRepetidas = (datas) => { 
    const datasUnicas = []
    datas.forEach((data => { 
        if(datasUnicas.indexOf(data.date) === -1){
            datasUnicas.push(data.date)
        }
    }))
    return datasUnicas
}

export const ordenaDatas = (data) => { 
    data.sort((a, b) => {
        const primeiraData = moment(a, 'DD/MM/YYYY').format('DDMMYYYY')
        const segundaData = moment(b, 'DD/MM/YYYY').format('DDMMYYYY')
       return primeiraData - segundaData
    })
}