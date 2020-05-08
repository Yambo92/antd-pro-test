import React from 'react'

export default function LinkButton(props) {

// return <button onClick={props.onClick} className="link-button">{props.children}</button>
return <button {...props} className="link-button" style={{
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: '#40a9ff',
    cursor: "pointer",
}}></button>

}