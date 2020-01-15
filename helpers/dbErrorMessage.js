const getErrorMessage = err => {
  let message = ''

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        return getDatabaseErrorMessage(err)

      default:
        return 'Something went wrong'
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        return err.errors[errName].message
      }
    }
  }
}

const getDatabaseErrorMessage = err => {
  let fieldName = err.message
    .match(/\w+_/)
    .join('')
    .slice(0, -1)

  return `${fieldName || 'unique field'} already exists`
}

module.exports = getErrorMessage
