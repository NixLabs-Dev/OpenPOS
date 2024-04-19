export default function Modal(props : {
    state: boolean,
    closeModal: any;
    children: React.ReactNode
}){

    return (
        <div className={`w-screen h-screen flex items-center justify-center fixed inset-0 ${props.state ? "block bg-black/50" : "hidden"}`}>
            <div className='w-96 h-96 bg-zinc-700 rounded-3xl p-8'>
                {props.children}
            </div>
        </div>
    )
}