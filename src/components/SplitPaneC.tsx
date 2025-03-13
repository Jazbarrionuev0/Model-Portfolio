import React, { useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import Image from "next/image";


function SplitPaneC() {
    const [sizes, setSizes] = useState([100, 'auto', 'auto']);

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover', // Ensure the image covers the entire div
        backgroundPosition: 'center', // Center the image
        backgroundImage: 'url("/back.png")',
    };
    return (
        <div style={{ height: 500 }} className='relative'>

            <SplitPane
                split='vertical'
                sizes={sizes}
                onChange={setSizes}
                className='bg-transparent'
            >
                <Pane >
                    <div style={{ ...layoutCSS, background: 'transparent' }} className='relative'>
                        <Image src="/back.png" alt="Image 1" layout="responsive" width={1920} height={1080} className="absolute" />

                    </div>
                </Pane>
                <div style={{ ...layoutCSS, background: 'red' }}>
                    pane2
                </div>

            </SplitPane>
        </div>
    )
}

export default SplitPaneC