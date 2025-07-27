interface LoadingSpinnerProps {
    message: string;
    subMessage?: string;
    color?: 'blue' | 'green' | 'red';
}

function LoadingSpinner({ message, subMessage, color = 'blue' }: LoadingSpinnerProps) {
    const colorClasses = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500'
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white space-y-4">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${colorClasses[color]}`}></div>
            <div className="text-gray-600">{message}</div>
            {subMessage && (
                <div className="text-sm text-gray-400">{subMessage}</div>
            )}
        </div>
    );
}

export default LoadingSpinner;