interface PageProps {
    params: { id: string }
}

export default function dashboard({ params }: PageProps) {
    return (
        <div>
            Dashboard 
            <h1> {params.id}</h1>
        </div>
    )
}