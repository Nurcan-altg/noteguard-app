import ScoreCard from './ScoreCard'
import HighlightedTextViewer from './HighlightedTextViewer'

interface AnalysisResult {
  success: boolean
  result: {
    grammar_score: number
    repetition_score: number
    semantic_score: number
    overall_score: number
    grammar_errors: Array<{
      message: string
      offset: number
      length: number
      rule_id: string
      suggestion: string | null
    }>
    repetition_errors: Array<{
      word: string
      count: number
      positions: number[]
      suggestion: string | null
    }>
    semantic_coherence: {
      score: number
      explanation: string
    }
    suggestions: string[]
  }
  processing_time: number
}

interface ResultsDashboardProps {
  result: AnalysisResult
  text?: string
}

const ResultsDashboard = ({ result, text }: ResultsDashboardProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard
          title="Overall Score"
          score={result.result.overall_score}
          color="primary"
          icon="🎯"
        />
        <ScoreCard
          title="Grammar Score"
          score={result.result.grammar_score}
          color="success"
          icon="📝"
        />
        <ScoreCard
          title="Repetition Score"
          score={result.result.repetition_score}
          color="warning"
          icon="🔄"
        />
        <ScoreCard
          title="Semantic Score"
          score={result.result.semantic_coherence?.score * 100 || 0}
          color="info"
          icon="🧠"
        />
      </div>

      {/* Processing Time */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Analysis completed in {result.processing_time.toFixed(2)} seconds
        </p>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HighlightedTextViewer
          grammarErrors={result.result.grammar_errors}
          repetitionErrors={result.result.repetition_errors}
          text={text}
        />
        
        {/* Suggestions Panel */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Suggestions
            </h3>
            <div className="space-y-3">
              {result.result.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-text-secondary">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Semantic Analysis
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {result.result.semantic_coherence?.explanation || 'Semantic analysis not available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDashboard 