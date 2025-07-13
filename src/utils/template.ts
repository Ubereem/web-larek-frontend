export function createElementFromTemplate(templateId: string): HTMLElement {
    const template = document.querySelector(`#${templateId}`) as HTMLTemplateElement;
    if (!template) {
        throw new Error(`Template with id "${templateId}" not found`);
    }
    
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const element = fragment.firstElementChild as HTMLElement;
    
    if (!element) {
        throw new Error(`Template "${templateId}" is empty`);
    }
    
    return element;
} 