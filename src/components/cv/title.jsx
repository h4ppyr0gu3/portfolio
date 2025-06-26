export default function Title(props) {
  return (
    <div className="flex sm:flex-row flex-col">
       <h1 className="font-bold text-3xl px-3 mx-3 w-full sm:w-1/3 block">{props.title}</h1>
       <div className="w-full mb-5">
        { props.children }
       </div>
    </div>
  )
}
