const timestamp:string = Date.now().toString(36);
const randomPart:string = Math.random().toString(36).substring(2, 8);

function generateId(): string {
    return `${timestamp} - ${randomPart}`
}

export {
    generateId,
}