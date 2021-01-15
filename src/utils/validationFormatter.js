const mongooseErrorFormatter = (rawErrors) => {
  let errors = {};
  const details = rawErrors.errors
  for (let key in details) {
    errors[key] = {msg:details[key].message }
  }
  return JSON.stringify({ ...errors })
}
module.exports = { mongooseErrorFormatter }
