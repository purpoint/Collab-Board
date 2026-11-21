export const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  // always send a plain string so the frontend can display it directly
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Something went wrong, please try again'
  })
}