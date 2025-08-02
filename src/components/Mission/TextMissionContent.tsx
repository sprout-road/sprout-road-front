interface TextMissionContentProps {
    text: string;
    setText: (text: string) => void;
}

function TextMissionContent({ text, setText }: TextMissionContentProps) {
    return (
        <div className="flex flex-col">
            <div className="border-2 border-black p-2 focus-within:outline-lime-400 focus-within:outline-2 focus-within:border-0">
                <textarea 
                    placeholder="최소 20자의 글을 작성해주세요..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={100}
                    className="min-h-30 w-full focus:outline-0"
                />
            </div>
            <span className="text-end">{text.length}자/{100}</span>
        </div>
    );
}

export default TextMissionContent;