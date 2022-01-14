//import { Link } from 'react-router-dom'
//import { useState, useEffect } from 'react'


const Notification = (props) => {

    return (
        props.notice ?
            <>
                {props.notice}
            </>
            : ''
    );
}

export default Notification
