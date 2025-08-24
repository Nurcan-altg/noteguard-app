import { ChangeEvent } from 'react'

interface ReferenceTopicInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const ReferenceTopicInput = ({ value, onChange, placeholder, disabled }: ReferenceTopicInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2 flex-1">
      <label htmlFor="reference-topic" className="block text-sm font-medium text-text-primary">
        Referans Konu (İsteğe Bağlı)
      </label>
      <input
        id="reference-topic"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field w-full"
      />
    </div>
  )
}

export default ReferenceTopicInput 