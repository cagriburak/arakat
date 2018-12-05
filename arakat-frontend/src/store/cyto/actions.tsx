import {ActionCreator} from "redux";
import { INodeOffset } from "../../common/models/cyto-elements/node-offset";
import {
    IAddNodeToGraphNodes,
    IAddNodeToExistingNodes,
    IFetchNodeSpecs,
    IIncreaseCVNodesLength,
    IIncreasePipelineNodesLength,
    IIncreaseTaskNodesLength,
    INodeSpecsFetched,
    ISetIsNodeParametersDialogOpen,
    ISetLastDroppedNodeOffset,
    ISetSelectedNode,
    IUpdateGraphNode,
    IFetchEdgePermissions,
    IEdgePermissionsFetched,
    IAddEdgeToGraphEdges,
    ISetGraph,
    ISetIsGraphPropertiesDialogOpen,
    ISetDagProperties,
    IRunGraph,
    ISaveGraph,
    ISetIsAboutToRun,
    ISetIsAboutToSave,
    IFetchGraphs,
    IFetchGraph,
    IGraphsFetched,
    IGraphFetched,
    ISetIsLoadedGraphsDialogOpen,
    ISetIsGraphLoaded
} from "./types";

export const fetchNodeSpecs: ActionCreator<IFetchNodeSpecs> = () => ({
    type: "@@cyto/FETCH_NODESPECS",
});

export const nodeSpecsFetched: ActionCreator<INodeSpecsFetched> = (nodeSpecs: any[]) => ({
    payload: {
        nodeSpecs,
    },
    type: "@@cyto/NODESPECS_FETCHED",
});

export const addNodeToExistingNodes: ActionCreator<IAddNodeToExistingNodes> = (nodeSpec: any) => ({
    payload: {
        nodeSpec,
    },
    type: "@@cyto/ADD_NODE_TO_EXISTINGNODES",
});

// "@@cyto/INCREASE_CVNODES_LENGTH"
export const increaseCVNodesLength: ActionCreator<IIncreaseCVNodesLength> = () => ({
    type: "@@cyto/INCREASE_CVNODES_LENGTH",
});
export const increasePipelineNodesLength: ActionCreator<IIncreasePipelineNodesLength> = () => ({
    type: "@@cyto/INCREASE_PIPELINENODES_LENGTH",
});
export const increaseTaskNodesLength: ActionCreator<IIncreaseTaskNodesLength> = () => ({
    type: "@@cyto/INCREASE_TASKNODES_LENGTH",
});

export const setLastDroppedNodeOffset: ActionCreator<ISetLastDroppedNodeOffset> = (offset: INodeOffset) => ({
    payload: {
        offset,
    },
    type: "@@cyto/SET_LASTDROPPEDNODE_OFFSET",
});

export const setSelectedNode: ActionCreator<ISetSelectedNode> = (selectedNode: any) => ({
    payload: {
        selectedNode,
    },
    type: "@@cyto/SET_SELECTEDNODE",
});

export const setIsAboutToRun: ActionCreator<ISetIsAboutToRun> = (isAboutToRun: boolean) => ({
    payload: {
        isAboutToRun,
    },
    type: "@@cyto/SET_IS_ABOUT_TO_RUN",
});

export const setIsAboutToSave: ActionCreator<ISetIsAboutToSave> = (isAboutToSave: boolean) => ({
    payload: {
        isAboutToSave,
    },
    type: "@@cyto/SET_IS_ABOUT_TO_SAVE",
});

export const setIsNodeParametersDialogOpen: ActionCreator<ISetIsNodeParametersDialogOpen> = (isDialogOpen: boolean) => ({
    payload: {
        isDialogOpen,
    },
    type: "@@cyto/SET_ISNODEPARAMETERSDIALOG_OPEN",
});

export const addNodeToGraphNodes: ActionCreator<IAddNodeToGraphNodes> = (node: any) => ({
    payload: {
        node,
    },
    type: "@@cyto/ADD_NODE_TO_GRAPH_NODES",
});

export const updateDagNode: ActionCreator<IUpdateGraphNode> = (node: any, index: number) => ({
    payload: {
        node,
        index,
    },
    type: "@@cyto/UPDATE_GRAPH_NODE",
});

export const addEdgeToGraphEdges: ActionCreator<IAddEdgeToGraphEdges> = (key: string, edge: any) => ({
    payload: {
        key,
        edge,
    },
    type: "@@cyto/ADD_EDGE_TO_GRAPH_EDGES",
});

export const fetchEdgePermissions: ActionCreator<IFetchEdgePermissions> = () => ({
    type: "@@cyto/FETCH_EDGEPERMISSIONS",
});

export const edgePermissionsFetched: ActionCreator<IEdgePermissionsFetched> = (edgePermissions: any) => ({
    payload: {
        edgePermissions,
    },
    type: "@@cyto/EDGEPERMISSIONS_FETCHED",
});

export const setGraph: ActionCreator<ISetGraph> = (graph: any) => ({
    payload: {
        graph
    },
    type: '@@cyto/SET_GRAPH',
});

export const setIsGraphPropertiesDialogOpen: ActionCreator<ISetIsGraphPropertiesDialogOpen> = (isOpen: boolean) => ({
    payload: {
        isOpen
    },
    type: '@@cyto/SET_IS_GRAPH_EXECUTE_DIALOG_OPEN',
});

export const setGraphProperties: ActionCreator<ISetDagProperties> = (graphProperties: any) => ({
    payload: {
        graphProperties
    },
    type: '@@cyto/SET_GRAPH_PROPERTIES',
});

export const runGraph: ActionCreator<IRunGraph> = (graph: any) => ({
    payload: {
        graph
    },
    type: '@@cyto/RUN_GRAPH',
});

export const saveGraph: ActionCreator<ISaveGraph> = (graph: any) => ({
    payload: {
        graph
    },
    type: '@@cyto/SAVE_GRAPH',
});

export const fetchGraphs: ActionCreator<IFetchGraphs> = () => ({
    type: '@@cyto/FETCH_GRAPHS',
});

export const fetchGraph: ActionCreator<IFetchGraph> = (graphMongoId: string) => ({
    payload: {
        graphMongoId
    },
    type: '@@cyto/FETCH_GRAPH',
});

export const graphsFetched: ActionCreator<IGraphsFetched> = (graphs: any[]) => ({
    payload: {
        graphs,
    },
    type: "@@cyto/GRAPHS_FETCHED",
});

export const graphFetched: ActionCreator<IGraphFetched> = (graph: any) => ({
    payload: {
        graph,
    },
    type: "@@cyto/GRAPH_FETCHED",
});

export const setIsLoadedGraphsDialogOpen: ActionCreator<ISetIsLoadedGraphsDialogOpen> = (isOpen: boolean) => ({
    payload: {
        isOpen
    },
    type: '@@cyto/SET_IS_LOADED_GRAPHS_DIALOG_OPEN',
});

export const setIsGraphLoaded: ActionCreator<ISetIsGraphLoaded> = (isGraphLoaded: boolean) => ({
    payload: {
        isGraphLoaded
    },
    type: '@@cyto/SET_IS_GRAPH_LOADED',
});
