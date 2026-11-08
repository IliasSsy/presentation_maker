import { SlideList } from "./components/slideList/SlideList";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Workspace } from "./components/workspace/WorkSpace";
import { PreviewOverlay } from "./components/previewOverlay/PreviewOverlay";
import { getState, dispatch, getPreviewMode } from "./modules/editor";
import { addSlideModifier, deleteSlideModifier, setActiveSlide, setPreviewModeModifier } from "./modules/modifiers";

function App() {
  const state = getState();
  const isPreview = getPreviewMode();
  
  if (!state) {
    return null;
  }

  const activeSlideId = state.activeSlideId || state.presentation.slides[0]?.id;
  const activeSlide = state.presentation.slides.find(obj => obj.id === activeSlideId) || state.presentation.slides[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", margin: 0 }}>
      <Toolbar presentation={state.presentation} />
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