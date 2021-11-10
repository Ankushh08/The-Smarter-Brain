import React from "react";
import './FaceRecoganition.css';

const FaceRecoganition = ({ imageUrl, box }) => {
    return (
        <div
            className='center ma'>
            <div className='absolute mt2'>
                <img alt=''
                    src={imageUrl}
                    width='500px'
                    height='auto'
                    id='inputimage' />
                <div className='bounding-box'
                    style={{
                        top: box.topRow,
                        right: box.rightCol,
                        bottom: box.bottomRow,
                        left: box.leftCol
                    }}></div>
            </div>
        </div>
    )
}

export default FaceRecoganition;