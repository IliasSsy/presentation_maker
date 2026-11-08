import type { TextChunk, InlineStyle } from "../../../../../../types/objects";

type StackItem = {
    node: Node,
    style: InlineStyle
}

function parseHtmlToChunks(node: Node, baseStyle: InlineStyle): TextChunk[] {
    const chunks: TextChunk[] = [];
    const stack: StackItem[] = [{
        node,
        style: baseStyle
    }];
    
    while (stack.length > 0) {
        const item = stack.pop();
        if (!item) continue;
        
        const currentNode = item.node;
        const currentStyle: InlineStyle = item.style;
        
        if (currentNode.nodeType === Node.TEXT_NODE) {
            const text = currentNode.textContent;
            if (text) {
                chunks.push({ text, style: currentStyle });  
            }
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const element = currentNode;
            const nextStyle: InlineStyle = { ...currentStyle };
            const tag = element.nodeName;
            if (tag === 'STRONG' || tag === 'B') {
                nextStyle.bold = true;
            } else if (tag === 'EM' || tag === 'I') {
                nextStyle.italic = true;
            } else if (tag === 'U') {
                nextStyle.underline = true;
            }
            const children = element.childNodes;
            for (let i = children.length - 1; i >= 0; i--) {
                stack.push({
                    node: children[i],
                    style: nextStyle
                });
            }
        }
    }

    return chunks;   
}

export { parseHtmlToChunks };