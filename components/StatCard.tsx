type StatCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color: "blue" | "green" | "purple"
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  color,
}: StatCardProps) {

  const colorMap: Record<StatCardProps["color"], string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow transition flex justify-between items-center">
      
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-xs text-gray-400 mt-1">{change}</p>
      </div>

      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>

    </div>
  )
}