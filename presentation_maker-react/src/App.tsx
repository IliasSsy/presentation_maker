import { SlideList } from "./components/SlideList/slideList";
import { Toolbar } from "./components/Toolbar/Main/toolbar";
import { Workspace } from "./components/Workspace/workSpace";
import { getState, dispatch } from "./modules/editor";
import { addSlideModifier, deleteSlideModifier, setActiveSlide } from "./modules/modifiers";

function App() {
    const presentation = getState();
    if (!presentation) {
        return null;
    }
    const activeSlideId = presentation.activeSlideId || presentation.slides[0]?.id;
    const activeSlide = presentation.slides.find((object) => object.id === activeSlideId) || presentation.slides[0];
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", margin: 0 }}>
            <Toolbar presentation={presentation} />

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <SlideList
                    presentation={presentation}
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
        </div>
    );
}

export { App };