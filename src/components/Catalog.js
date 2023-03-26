
import './Catalog.css';

import Snippet from './Snippet.js';

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function Catalog(props) {
    const [open, setOpen] = useState(true);

    //const id = props.title.replace(/\s/gmi,'');

    return (
        <div className='text-end'>
            <Button className="btn btn-lg btn-link collapse-title text-white" onClick={() => setOpen(!open)}>
                {props.title}
            </Button>
            <Collapse in={open}>
                <ul className="list-of-snippets list-unstyled" key={props.items}>
                    {
                        props.items.map(item => {
                            return (
                                <Snippet place={item}/>
                            )
                        })
                    }
                </ul>
            </Collapse>
        </div>
    );
}

export default Catalog;