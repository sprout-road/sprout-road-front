interface ErrorComponentProps {
    error: string
    refetch?: () => void
}

function ErrorComponent({error, refetch}: ErrorComponentProps) {
    return (
        <div className="flex justify-center text-red-500">
            <p>데이터를 불러오는데 실패했습니다.</p>
            <p>{error}</p>
            <button onClick={refetch} className="bg-blue-400 text-white font-bold"/>
        </div>
    )
}

export default ErrorComponent