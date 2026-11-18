import { SlideList } from "./components/SlideList/slideList";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { Workspace } from "./components/Workspace/workSpace";
import { PreviewOverlay } from "./components/previewOverlay/PreviewOverlay";
import { getState, dispatch, getPreviewMode} from "./modules/editor";
import { addSlideModifier, deleteSlideModifier, setActiveSlide, setPreviewModeModifier } from "./modules/modifiers";
import useHistoryUI from "./components/hooks/useHistoryUI";

function App() {
    const state = getState();
    const isPreview = getPreviewMode();
    const { canUndo, canRedo, onUndo, onRedo } = useHistoryUI();

    if (!state) {
        return null;
    }

    const activeSlideId = state.activeSlideId || state.presentation.slides[0]?.id;
    const activeSlide = state.presentation.slides.find(obj => obj.id === activeSlideId) || state.presentation.slides[0];

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", margin: 0 }}>
            <Toolbar 
                presentation={state.presentation}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={onUndo}
                onRedo={onRedo}
            />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <SlideList 
                    presentation={state.presentation}
                    activeSlideId={activeSlideId}
                    onSelectSlide={(id) => {
                        dispatch(setActiveSlide, id);
                    }}
                    onAddSlide={() => {
                        dispatch(addSlideModifier);
                    }}
                    onDeleteSlide={(id) => {
                        dispatch(deleteSlideModifier, id);
                    }}
                />
                <Workspace activeSlide={activeSlide} />
            </div>
            {isPreview && (
                <PreviewOverlay 
                    presentation={state.presentation} 
                    onClose={() => dispatch(setPreviewModeModifier, false)} 
                />
            )}
        </div>
    );
}

export { App };