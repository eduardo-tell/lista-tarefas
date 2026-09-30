// Junta classes internas do componente com as classes escritas no host.
// Existe porque custom elements são o wrapper; o visual precisa ir no controle nativo.

// Classes que devem ficar só no host (estado do wrapper), não no input/botão interno.
const CLASSES_SO_DO_HOST = new Set(['is-invalid', 'input-shake']);

export const mesclarClasses = (host, ...classesInternas) => {
    // Junta as classes do componente com o atributo class="" do HTML.
    const classes = [...classesInternas, host.getAttribute('class') || '']
        // Quebra "btn w-100" em tokens separados.
        .flatMap((item) => String(item).split(/\s+/))
        // Remove strings vazias geradas por espaços duplicados.
        .filter(Boolean)
        // Impede que is-invalid vaze para o controle interno duas vezes.
        .filter((classe) => !CLASSES_SO_DO_HOST.has(classe));

    // Set elimina duplicatas ("btn btn" vira "btn").
    return [...new Set(classes)].join(' ');
};
