import React from 'react'
import {ICar} from './TypeScriptDemo'

interface IProps {
    car: ICar
}

export const CarItem: React.FC<IProps> = ({car}) => {
    return (
        <div>
            <h1>{car.color}</h1>
        </div>
    )
}

export default CarItem
