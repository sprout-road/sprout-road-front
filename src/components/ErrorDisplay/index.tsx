interface ErrorDisplayProps {
    title: string;
    message: string;
    onRetry?: () => void;
    retryText?: string;
    helpText?: string[];
}

function ErrorDisplay({
                          title,
                          message,
                          onRetry,
                          retryText = '🔄 새로고침',
                          helpText
                      }: ErrorDisplayProps) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-center px-6 space-y-6">
            <div className="text-8xl">📍</div>
            <div>
                <div className="text-xl font-semibold text-gray-800 mb-2">{title}</div>
                <div className="text-gray-600 mb-4 max-w-md">{message}</div>
            </div>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    {retryText}
                </button>
            )}

            {helpText && helpText.length > 0 && (
                <div className="text-xs text-gray-400 max-w-md space-y-1">
                    {helpText.map((text, index) => (
                        <div key={index}>{text}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ErrorDisplay;