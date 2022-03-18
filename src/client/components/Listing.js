import React from 'react'

function Listing(props) {
 const info = [props.info]
  return (
    <div>@{props.info.handle}</div>
  )
}

export default Listing