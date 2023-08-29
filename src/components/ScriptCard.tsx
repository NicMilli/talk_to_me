const ScriptCard = ({
  script,
}: {
  script: {
    title: string
    content: string
    createdAt: Date
  }
}) => {
  const date = new Date(script.createdAt).toDateString()
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-[2px_5px_8px_2px] shadow-white/60">
      <div className="px-2 py-2 text-gray-950 text-xs">
        <h6>{date}</h6>
      </div>
      <div className="px-2 py-2 text-gray-950 font-semibold">
        {script.title}
      </div>
      <div className="px-2 py-2 text-gray-950">{script.content}</div>
    </div>
  )
}

export default ScriptCard
