import React from 'react';

const LinkCard = ({link}) => {
    return (
        <div>
            <>
                <h2>Link</h2>
                <p>Shortened link <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
                <p>From <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
                <p>Clicks counter: <strong>{link.clicks}</strong> </p>
                <p>Creation date: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
            </>
        </div>
    );
};

export default LinkCard;