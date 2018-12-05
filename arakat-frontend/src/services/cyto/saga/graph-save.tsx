import {call, takeLatest} from "redux-saga/effects";
import { saveGraph } from "../api";

/**
 * graph save
 */
function* graphSave(action) {
    try {
        const response = yield call(saveGraph, action.payload.graph);
        console.log('response:');
        console.log(response);        
    } catch ( error ) {
        console.log("graphRun() -> failed! | error: ");
        console.log(error);
    }
}

/**
 * watcher
 */
export function* saveGraphWatcher() {
    yield takeLatest("@@cyto/SAVE_GRAPH", graphSave);
}
