interface ScoreCardProps {
  title: string
  score: number
  color: 'primary' | 'success' | 'warning' | 'error' | 'info'
  icon: string
}

const ScoreCard = ({ title, score, color, icon }: ScoreCardProps) => {
  const displayScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'
      case 'success':
        return 'bg-gradient-to-r from-[#43e97b] to-[#38f9d7]'
      case 'warning':
        return 'bg-gradient-to-r from-[#fa709a] to-[#fee140]'
      case 'error':
        return 'bg-gradient-to-r from-[#ef4444] to-[#f87171]'
      case 'info':
        return 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]'
      default:
        return 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-error'
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="metric-title">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-4xl font-bold mb-2 ${getScoreColor(displayScore)}`}>
        {displayScore.toFixed(1)}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColorClasses(color)}`}
          style={{ width: `${displayScore}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        {displayScore >= 80 ? 'Excellent' : displayScore >= 60 ? 'Good' : 'Needs Improvement'}
      </div>
    </div>
  )
}

export default ScoreCard 