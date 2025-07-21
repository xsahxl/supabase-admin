import React from "react"

const Loading = () => (
  <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
    aria-label="Loading..."
    tabIndex={0}
  >
    <span className="sr-only">Loading...</span>
  </div>
)

export default Loading
