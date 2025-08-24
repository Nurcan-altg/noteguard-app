import { ChangeEvent } from 'react'

interface TextInputAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const TextInputArea = ({ value, onChange, placeholder, disabled }: TextInputAreaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="text-input" className="block text-sm font-medium text-text-primary">
        Analiz Edilecek Metin
      </label>
      <textarea
        id="text-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field w-full min-h-[200px] resize-y font-primary"
        style={{ fontFamily: 'var(--font-family-primary)' }}
      />
    </div>
  )
}

export default TextInputArea 