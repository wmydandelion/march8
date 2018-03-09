import React from 'react'
import './header.less'
let Header = React.createClass({
    render() {
        return ( <
            div className = "components-header" >

            <
            img src = "/static/immages/logo.png"
            width = "40"
            alt = "" >
            <
            h1 className = "caption" > React Music Player < /h1> < /
            div >
        );
    }
});

export default Header;