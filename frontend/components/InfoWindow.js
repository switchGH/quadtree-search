import React from 'react';
import PropTypes from 'prop-types';

const InfoWindow = props => {
    const { place } = props;
    const infoWindowStyle = {
        position: 'relative',
        bottom: 120,
        borderRadius: '10px',
        left: '-45px',
        width: 220,
        backgroundColor: 'white',
        boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
        padding: 10,
        fontSize: 14,
        zIndex: 100,
    };

    return (
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 14 }}>{place.name}</div>
            {/* <div style={{fontSize: 10 }}>
          <span style={{ color: 'grey' }}>〒{place.post_code}</span>
        </div>
        <div style={{fontSize: 10 }}>
          <span style={{ color: 'grey' }}>{place.municipality}{place.street_branch}{place.building_name}</span>
        </div> */}
            {/* <div style={{ fontSize: 14 }}>
        <span style={{ color: 'grey' }}>
          {place.rating}
          {' '}
        </span>
        <span style={{ color: 'orange' }}>
          {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
        </span>
        <span style={{ color: 'lightgrey' }}>
          {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {place.types[0]}
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {'$'.repeat(place.price_level)}
      </div>
      <div style={{ fontSize: 14, color: 'green' }}>
        {place.opening_hours.open_now ? 'Open' : 'Closed'}
      </div> */}
        </div>
    );
};

InfoWindow.propTypes = {
    place: PropTypes.shape({
        name: PropTypes.string,
        formatted_address: PropTypes.string,
        rating: PropTypes.number,
        types: PropTypes.arrayOf(PropTypes.string),
        price_level: PropTypes.number,
        opening_hours: PropTypes.shape({
            open_now: PropTypes.bool,
        }),
    }).isRequired,
};

export default InfoWindow;
