import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';


export default class CanvasPane extends React.Component {

    constructor(props) {
        super(props);

        this.svgElement = null;
    }

    getSvgElement() {
        return this.svgElement;
    }

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg ref={element => this.svgElement = element}
                     version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     width={this.props.width} height={this.props.height}>
                    <rect width={'100%'} height={'100%'} fill={this.props.style.backgroundColor}/>
                    {this.drawWhiteboardCanvas()}
                    {this.drawImageBorder()}
                </svg>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        return this.props.eventStore.reduceEvents().map((element, index) => {
            if (element.type === Constants.SVG_ELEMENT_TYPE.LINE) {
                const k = index;
                const d = element.values.map((point, index) => {
                    if (index === 0) {
                        return 'M ' + point.x + ' ' + point.y;
                    } else {
                        return 'L ' + point.x + ' ' + point.y;
                    }
                });

                return (
                    <path key={k} d={d.join(' ')} fill="none" stroke={element.strokeColor} strokeWidth={element.strokeWidth}/>
                );

            } else if (element.type === Constants.SVG_ELEMENT_TYPE.IMAGE) {
                const k = index;
                const image = element.values[0];

                return (
                    <image key={k} x={image.x} y={image.y} width={image.width} height={image.height} xlinkHref={image.dataUrl}/>
                );

            } else {
                return null;
            }
        });
    }

    drawImageBorder() {
        const lastImage = this.props.eventStore.lastImage();
        if (!lastImage) {
            return;
        }

        return (
            <rect x={lastImage.x} y={lastImage.y} width={lastImage.width} height={lastImage.height}
                  fill={'none'} stroke={'black'} strokeDasharray={'5,5'}/>
        );
    }
}

CanvasPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    eventStore: PropTypes.object,
    style: PropTypes.shape({
        backgroundColor: PropTypes.string,
    }),
};
