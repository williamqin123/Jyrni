
import './Snippet.css'

import Card from 'react-bootstrap/Card';

function Snippet(props) {

    // do not hardcode!
    const API_KEY = 'AIzaSyDDH6uYOpSoa91ZPzZB6U4G0-4hAJZWIa4';

    //console.log(props.place.photos?.[0].getUrl());

    // `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photo_reference=${props.place?.photos?.[0]?.photo_reference}&key=${API_KEY}

    return (
        <Card className='shadow Snippet' onMouseDown={() => {
            window.dragged = {
                name:props.place?.name,
                photoURL:props.place.photos?.[0].getUrl(),
                place:props.place,
            };
        }}>
            <Card.Img variant="left" src={props.place.photos?.[0].getUrl()} />
            <Card.Body>
                <Card.Title>
                    {props.place?.name}
                </Card.Title>
                <Card.Text>
                    <p>
                        <small>{props.place?.formatted_address}</small>
                    </p>
                    <p>
                        {props.place?.editorial_summary?.overview}
                    </p>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Snippet;