import { TravelLogContents } from "../types/travelLogTypes";


// 에디터에 입력된 글들을 서버 api 형식으로 파싱하는 함수
export const parseTagToBlocks = (html: string): TravelLogContents[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: TravelLogContents[] = [];
    let order = 1;

    // 각 요소를 순회하며 텍스트와 이미지 분리
    const processElement = (element: Element) => {
        const childNodes = Array.from(element.childNodes);
        let currentTextContent = '';
        
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                currentTextContent += node.textContent || '';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const childElement = node as Element;
                
                if (childElement.tagName === 'IMG') {
                    // 현재까지의 텍스트가 있으면 텍스트 블록 생성
                    if (currentTextContent) {
                        blocks.push({
                            type: "text",
                            order: order++,
                            content: {
                                text: currentTextContent
                            }
                        });
                        currentTextContent = '';
                    }
                    
                    // 이미지 블록 생성
                    const img = childElement as HTMLImageElement;
                    blocks.push({
                        type: "image",
                        order: order++,
                        content: {
                            url: img.src,
                            caption: img.alt || ''
                        }
                    });
                } else {
                    currentTextContent += node.nodeValue;
                }
            }
        });
        
        // 남은 텍스트가 있으면 텍스트 블록 생성
        if (currentTextContent) {
            blocks.push({
                type: "text",
                order: order++,
                content: {
                    text: currentTextContent
                }
            });
        }
    };

    // 최종 처리 로직
    Array.from(doc.body.children).forEach(element => {
        if (element.querySelector('img')) {
            processElement(element);
        } else if (element.textContent || element.innerHTML.trim()) {
            const textContent = element.textContent?.trim() || '';

            blocks.push({
                type: "text",
                order: order++,
                content: {
                    text: textContent
                }
            });
        }
    });

    // 빈 블록일 경우 원본 HTML 그대로 사용
    if (blocks.length === 0 && html.trim()) {
        blocks.push({
            order: 1,
            type: "text",
            content: {
                text: html
            }
        });
    }

    return blocks;
};