export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message" role="alert">
      <div className="error-mark" aria-hidden="true">!</div>
      <div>
        <strong>Analysis unavailable</strong>
        <p>{message || 'Something went wrong. Check your inputs and try again.'}</p>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss error">×</button>
    </div>
  )
}
