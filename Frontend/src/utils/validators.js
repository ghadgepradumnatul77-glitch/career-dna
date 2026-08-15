export const validateResumeFile = (file) => {
  if (!file) {
    return { valid: false, message: 'Please select a resume file.' }
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) {
    return { valid: false, message: 'Only PDF format resumes are accepted.' }
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, message: 'File size exceeds 10MB limit.' }
  }

  return { valid: true, message: 'Valid PDF file' }
}

export const validateGithubInput = (input) => {
  if (!input || !input.trim()) {
    return { valid: false, message: 'Please enter a GitHub username or profile URL.' }
  }

  const clean = input.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/

  if (!usernameRegex.test(clean)) {
    return { valid: false, message: 'Please enter a valid GitHub username.' }
  }

  return { valid: true, username: clean, message: 'Valid GitHub profile' }
}
