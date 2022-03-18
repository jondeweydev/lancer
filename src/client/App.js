import React from 'react';

import ListContainer from './components/ListContainer';
import Dock from './components/Dock'

export function App() {
    return (
        <div>
            <h1>LANCER</h1>
            <ListContainer></ListContainer>
            <Dock></Dock>
        </div>
    )
}