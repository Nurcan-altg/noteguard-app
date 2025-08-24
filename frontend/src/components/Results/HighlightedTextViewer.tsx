import { GrammarError, RepetitionError } from '../../services/apiService'

interface HighlightedTextViewerProps {
  grammarErrors: GrammarError[]
  repetitionErrors: RepetitionError[]
  text?: string
}

const HighlightedTextViewer = ({ grammarErrors, repetitionErrors, text }: HighlightedTextViewerProps) => {
  const renderHighlightedText = () => {
    if (!text) return null

    const errorRanges: Array<{ start: number; end: number; type: 'grammar' | 'repetition'; error: any }> = []

    // Add grammar error ranges
    grammarErrors.forEach(error => {
      errorRanges.push({
        start: error.offset,
        end: error.offset + error.length,
        type: 'grammar',
        error
      })
    })

    // Add repetition error ranges (simplified - just highlight the first occurrence)
    repetitionErrors.forEach(error => {
      if (error.positions.length > 0) {
        const wordStart = text.indexOf(error.word, error.positions[0])
        if (wordStart !== -1) {
          errorRanges.push({
            start: wordStart,
            end: wordStart + error.word.length,
            type: 'repetition',
            error
          })
        }
      }
    })

    // Sort ranges by start position
    errorRanges.sort((a, b) => a.start - b.start)

    // Render text with highlights
    const parts: JSX.Element[] = []
    let lastIndex = 0

    errorRanges.forEach((range, index) => {
      // Add text before error
      if (range.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, range.start)}
          </span>
        )
      }

      // Add highlighted error
      const errorText = text.slice(range.start, range.end)
      const highlightClass = range.type === 'grammar' 
        ? 'bg-red-200 border-b-2 border-red-400' 
        : 'bg-yellow-200 border-b-2 border-yellow-400'

      parts.push(
        <span
          key={`error-${index}`}
          className={`${highlightClass} cursor-help relative group`}
          title={range.type === 'grammar' 
            ? range.error.message 
            : `"${range.error.word}" repeated ${range.error.count} times`
          }
        >
          {errorText}
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-xs">
            {range.type === 'grammar' 
              ? range.error.message 
              : `"${range.error.word}" repeated ${range.error.count} times`
            }
          </div>
        </span>
      )

      lastIndex = range.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      )
    }

    return parts
  }
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Text Analysis
      </h3>
      
      {/* Highlighted Text */}
      {text && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-text-primary mb-3">
            Highlighted Text
          </h4>
          <div className="p-4 bg-gray-50 rounded-md border font-mono text-sm leading-relaxed">
            {renderHighlightedText()}
          </div>
          <div className="mt-2 text-xs text-text-secondary">
            <span className="inline-block w-3 h-3 bg-red-200 border-b-2 border-red-400 mr-2"></span>
            Grammar errors
            <span className="inline-block w-3 h-3 bg-yellow-200 border-b-2 border-yellow-400 ml-4 mr-2"></span>
            Repetition issues
          </div>
        </div>
      )}

      {/* Grammar Errors */}
      {grammarErrors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-text-primary mb-3">
            Grammar Errors ({grammarErrors.length})
          </h4>
          <div className="space-y-3">
            {grammarErrors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">
                  {error.message}
                </p>
                {error.suggestions && error.suggestions.length > 0 && (
                  <div className="text-xs text-red-600">
                    <span className="font-medium">Suggestions:</span> {error.suggestions.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repetition Errors */}
      {repetitionErrors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-text-primary mb-3">
            Repetition Issues ({repetitionErrors.length})
          </h4>
          <div className="space-y-3">
            {repetitionErrors.map((error, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Word "{error.word}" repeated {error.count} times
                </p>
                <p className="text-xs text-yellow-600">
                  Consider using synonyms or rephrasing to improve variety.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Errors Message */}
      {grammarErrors.length === 0 && repetitionErrors.length === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800">
            Great! No significant issues found in your text.
          </p>
        </div>
      )}
    </div>
  )
}

export default HighlightedTextViewer 