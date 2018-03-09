import React from 'react';
import { MUSIC_LIST } from '../config/config';
import ListItem from '../components/listitem';

let List = React.createClass({
    render() {
        let Items = this.props.musicLIST.map((item) => {
            return ( <
                ListItem key = { item.id }
                data = { item } >
                <
                /ListItem>
            );

        });
        return ( <
            ul className = "mt20" > { item } <
            /ul>
        )
    }
});


export default List;