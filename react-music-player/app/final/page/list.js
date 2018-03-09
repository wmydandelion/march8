import React from 'react';
import { MUSIC_LIST } from '../config/config';
import ListItem from '../components/listItem';

let List = React.createClass({
    render() {
        let Items = this.props.MUSICLIST.map((item) => {
            return ( <
                ListItem key = { item.id }
                data = { item }
                focus = { this.props.currentMusicItem === item } >
                <
                /ListItem>
            );

        });
        return ( <
            ul > { item } <
            /ul>
        )
    }
});