/**
 * Junta as classes internas do web component com as classes
 * atribuídas no custom element (ex.: class="w-100") para aplicar
 * no elemento nativo interno.
 */
export const mesclarClasses = (host, ...classesInternas) => {
    const classes = [...classesInternas, host.getAttribute('class') || '']
        .flatMap((item) => String(item).split(/\s+/))
        .filter(Boolean);

    return [...new Set(classes)].join(' ');
};
