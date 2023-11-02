import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

function MethodCard(props) {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyles = {
        maxWidth: 445,
        transition: 'transform 0.3s',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
    };

    return (
        <Card 
            style={cardStyles}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            onClick={props.onClick}
        >
            <CardMedia
                component="img"
                alt={props.name}
                image={props.imageURL}
                title={props.name}
                style={{
                    paddingTop: '5.25%',
                    backgroundSize: 'cover'
                }}
            />
            <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.name}
                    </Typography>
                    {props.githubLink && (
                        <IconButton 
                            aria-label="GitHub link" 
                            onClick={() => window.open(props.githubLink, '_blank')}
                        >
                            <GitHubIcon />
                        </IconButton>
                    )}
                </div>
                {props.introduction && (
                    <Typography variant="body1" color="textSecondary" component="p">
                        {props.introduction}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default MethodCard;
