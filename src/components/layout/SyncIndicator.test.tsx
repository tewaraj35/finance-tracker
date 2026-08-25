import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SyncIndicator } from './SyncIndicator'

describe('SyncIndicator', () => {
  it('renders nothing when online', () => {
    const { container } = render(<SyncIndicator isOnline={true} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows an offline message when offline', () => {
    render(<SyncIndicator isOnline={false} />)
    expect(screen.getByText(/offline/i)).toBeInTheDocument()
  })
})
