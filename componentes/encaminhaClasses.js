/**
 * Junta as classes internas do web component com as classes
 * atribuídas no custom element (ex.: class="w-100") para aplicar
 * no elemento nativo interno.
 */
const CLASSES_SO_DO_HOST = new Set(['is-invalid', 'input-shake']);

export const mesclarClasses = (host, ...classesInternas) => {
    const classes = [...classesInternas, host.getAttribute('class') || '']
        .flatMap((item) => String(item).split(/\s+/))
        .filter(Boolean)
        .filter((classe) => !CLASSES_SO_DO_HOST.has(classe));

    return [...new Set(classes)].join(' ');
};
