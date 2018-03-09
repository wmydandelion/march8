import React from 'react';
require('./listItem.less');
let PubSub = require('pubsub-js');

let ListenItem = React.createClass({
    deleteHandler(item, event) {
        event.stopPropagation();
        PubSub.publish('DEL_MUSIC', item);
    },
    playMusic(item, e) {
        PubSub.publish('PLAY_MUSIC', item);
    },
    render() {
        let item = this.props.data;
        return ( <
            li className = { "row components-listitem${this.props.focus ? 'focus' : '' }" }
            onclick = { this.playMusic.bind(this, item) } >
            <
            p >
            <
            span className = 'bold' > { item.title } < /sapn> - {item.artist} <
            /p> <
            p className = "-col-auto delete"
            onClick = { this.deleteHandler.bind(this, item) } > < /p> <
            /li>
        );
    }

});
export default ListenItem;