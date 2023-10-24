import { Viewer, Worker} from '@react-pdf-viewer/core';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
// Import styles
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';

const disableScrollPlugin = () => {
    const renderViewer = (props) => {
        const { slot } = props;

        if (slot.subSlot && slot.subSlot.attrs && slot.subSlot.attrs.style) {
            slot.subSlot.attrs.style = Object.assign({}, slot.subSlot.attrs.style, {
                // Disable scrolling in the pages container
                overflow: 'hidden',
            });
        }

        return slot;
    };

    return {
        renderViewer,
    };
};

const disableScrollPluginInstance = disableScrollPlugin();
const fullScreenPluginInstance = fullScreenPlugin();

export default function Show() {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer defaultScale={SpecialZoomLevel.PageFit} fileUrl='/gamelki.pdf' plugins={[disableScrollPluginInstance, fullScreenPluginInstance]}/>
        </Worker>
    )
}