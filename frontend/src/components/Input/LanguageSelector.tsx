import { ChangeEvent } from 'react'

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const LanguageSelector = ({ value, onChange, disabled }: LanguageSelectorProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="language-selector" className="block text-sm font-medium text-text-primary">
        Language / Dil
      </label>
      <select
        id="language-selector"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="input-field w-full"
      >
        <option value="auto">Auto Detect / Otomatik Algıla</option>
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}

export default LanguageSelector
