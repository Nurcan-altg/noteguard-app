import ScoreCard from './ScoreCard'
import HighlightedTextViewer from './HighlightedTextViewer'
import { AnalyzeResponse, GrammarError, RepetitionError } from '../../services/apiService'

interface ResultsDashboardProps {
  result: AnalyzeResponse
  text?: string
}

interface ResultsDashboardProps {
  result: AnalysisResult
  text?: string
}

// Suggestions kategorilerini ayıran yardımcı fonksiyon
const categorizeSuggestions = (suggestions: string[]) => {
  const categories = {
    positive: [] as string[],
    grammar: [] as string[],
    repetition: [] as string[],
    semantic: [] as string[],
    general: [] as string[]
  }

  suggestions.forEach(suggestion => {
    const trimmedSuggestion = suggestion.trim()
    
    // Pozitif geri bildirimler (emoji ile başlayan)
    if (trimmedSuggestion.match(/^[🎉🎯✅🌟]/)) {
      categories.positive.push(trimmedSuggestion)
    }
    // Dilbilgisi önerileri
    else if (trimmedSuggestion.toLowerCase().includes('dilbilgisi') || 
             trimmedSuggestion.toLowerCase().includes('grammar') ||
             trimmedSuggestion.toLowerCase().includes('cümle yapı')) {
      categories.grammar.push(trimmedSuggestion)
    }
    // Tekrar önerileri
    else if (trimmedSuggestion.toLowerCase().includes('tekrar') || 
             trimmedSuggestion.toLowerCase().includes('repetition') ||
             trimmedSuggestion.toLowerCase().includes('çeşitlendir')) {
      categories.repetition.push(trimmedSuggestion)
    }
    // Anlamsal tutarlılık önerileri
    else if (trimmedSuggestion.toLowerCase().includes('anlamsal') || 
             trimmedSuggestion.toLowerCase().includes('semantic') ||
             trimmedSuggestion.toLowerCase().includes('tutarlılık') ||
             trimmedSuggestion.toLowerCase().includes('konu')) {
      categories.semantic.push(trimmedSuggestion)
    }
    // Genel öneriler
    else {
      categories.general.push(trimmedSuggestion)
    }
  })

  return categories
}

// Kategori başlıkları
const categoryTitles = {
  positive: '🎉 Pozitif Geri Bildirimler',
  grammar: '📝 Dilbilgisi Önerileri',
  repetition: '🔄 Tekrar Önerileri',
  semantic: '🧠 Anlamsal Tutarlılık',
  general: '💡 Genel Öneriler'
}

// Kategori renkleri
const categoryColors = {
  positive: 'text-green-600 bg-green-50 border-green-200',
  grammar: 'text-blue-600 bg-blue-50 border-blue-200',
  repetition: 'text-orange-600 bg-orange-50 border-orange-200',
  semantic: 'text-purple-600 bg-purple-50 border-purple-200',
  general: 'text-gray-600 bg-gray-50 border-gray-200'
}

const ResultsDashboard = ({ result, text }: ResultsDashboardProps) => {
  const categorizedSuggestions = categorizeSuggestions(result.result.suggestions)

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
              Öneriler ve Geri Bildirimler
            </h3>
            
            <div className="space-y-4">
              {/* Her kategori için ayrı bölüm */}
              {Object.entries(categorizedSuggestions).map(([category, suggestions]) => {
                if (suggestions.length === 0) return null
                
                return (
                  <div key={category} className={`rounded-lg border p-4 ${categoryColors[category as keyof typeof categoryColors]}`}>
                    <h4 className="font-medium mb-3 text-sm">
                      {categoryTitles[category as keyof typeof categoryTitles]}
                    </h4>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0 opacity-60"></div>
                          <p className="text-sm leading-relaxed">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
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