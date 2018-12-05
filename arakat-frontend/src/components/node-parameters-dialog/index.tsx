import React, { Component } from "react";
import { withStyles, WithStyles, Theme, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import NodeParameterComponent from "../node-parameter";
import { FormattedMessage } from "react-intl";

const style: any = (theme: Theme) => ({
    dialogContent: {
        backgroundColor: theme.palette.background.default,
        // width: theme.spacing.unit * 35,
        width: theme.spacing.unit * 75,        
    },
    dialogHeader: {
        fontSize: '1.7rem',
        fontWeight: 'normal'
    },

    cancelButton: {
        marginRight: '1vw',
        backgroundColor: '#E75050'
    },
    okButton: {
        backgroundColor: 'white',
    },
});

export interface INodeParametersProps {
    selectedNode: any;
    isDialogOpen: boolean;
    setIsNodeParametersDialogOpen: (isDialogOpen: boolean) => void;
    updateDagNode: (node: any) => void;

}
interface INodeParametersDialogComponentState {
    finalParameters: any;
}

type AllTypes = INodeParametersProps & WithStyles<"dialogContent" | 'dialogHeader' | 'cancelButton' |
                                                  'okButton' | 'okButtonText'>;

/**
 * DrawerComponent
 */
class NodeParametersDialogComponent extends Component<AllTypes, INodeParametersDialogComponentState> {
    constructor(props: AllTypes) {
        super(props);
        this.state = {
            finalParameters: {}
        }
    }

    public shouldComponentUpdate(nextProps) {
        if( this.props.isDialogOpen === false && nextProps.isDialogOpen === false) {
            return false;
        } else {
            return true;
        }        
    }
    
    public handleClose = () => {
        this.props.setIsNodeParametersDialogOpen(false);
    }
    public handleOK = () => {
        if( this.areTheParametersValidated() ) {
            this.props.setIsNodeParametersDialogOpen(false);
            let finalNode = Object.assign({}, this.props.selectedNode);
            delete finalNode.parameter_props;
            delete finalNode.df_constraints;
            finalNode['parameters'] = this.state.finalParameters;
            this.props.updateDagNode(finalNode);
        } else {
            alert("please fill the required fields.");
        }
    }

    public areTheParametersValidated = () => {
        let isValidate = true;
        for( let key in this.state.finalParameters ) {
            if( !this.state.finalParameters[key].optional ) {
                if ( this.state.finalParameters[key].value === "" ) {
                    isValidate = false;
                }
            }
        }
        return isValidate;
    }

    public getParameterComponents = () => {
        if ( this.props.isDialogOpen ) {
            const parameters = this.props.selectedNode.parameter_props.parameters;
            const parameterComponents = [];
            for (const key in parameters) {
                if ( true ) {
                    parameters[key].key = key;
                    parameterComponents.push(
                        <NodeParameterComponent
                            key={key}
                            parameter={parameters[key]}
                            setValueCallback={this.setParameterValue}
                        />,
                    );
                }
            }
            if( parameterComponents.length > 0 ) {  
                return parameterComponents;
            } else {
                return <span> Seçili noda ait parametre bulunmamaktadır. </span>
            }
        } else {
            return (
                <p> Please re-open the dialog.</p>
            );
        }
    }
    public regulateObjectProperties = (parameter) => {
        let regulatedParameter = {};
        let maxParentKeyNumber = 0;
        for( let key in parameter ) {
            if( parameter[key].parentKeys.length > maxParentKeyNumber ) {
                maxParentKeyNumber = parameter[key].parentKeys.length;
            }
        }
        for( let i = 0; i <= maxParentKeyNumber; i++ ) {
            for( let key in parameter ) {
                if( parameter[key].parentKeys.length === i ) {
                    if( i === 0 ) {
                        // parameter[key].value = {};
                        regulatedParameter[key] = parameter[key];                        
                    } else {
                        let movingReference = regulatedParameter;
                        for( let j = 0; j < parameter[key].parentKeys.length; j++ ) {
                            if( movingReference[parameter[key].parentKeys[j]].value === undefined ) {
                                movingReference[parameter[key].parentKeys[j]]['value'] = {};
                            } 
                            movingReference = movingReference[parameter[key].parentKeys[j]].value;
                        }
                        let newKey = '';
                        if( key[key.length - 1] === '*' ) {
                            newKey = key.slice( 0, key.length - 1);
                            movingReference[newKey] = parameter[key];
                        } else {
                            movingReference[key] = parameter[key];
                        }                        
                    }
                }
            }
        }
        return regulatedParameter; // TODO: remove parentKeys
    }
    public setParameterValue = (parameter) => {

        let localParameter = parameter;
        for( let key in parameter ) {
            if( parameter[key].parentKeys ) {
                localParameter = this.regulateObjectProperties(parameter);
                break;
            }
        }

        let finalParameters = {}; 
        if( this.state.finalParameters ) {
            finalParameters = this.state.finalParameters;
        }

        for( let key in localParameter ) {
            if( localParameter[key].value === '"' ) {
                localParameter[key].value = '\\\"';
            }
            finalParameters[key] = localParameter[key]
            
        }
        this.setState({
            finalParameters: finalParameters,
        });
    }
    /**
     * render output of cyto
     */
    public render(): JSX.Element {
        const { classes } = this.props;
        let dialogTitle = undefined;
        if( this.props.selectedNode ) {
            dialogTitle = 
            <span
                className={classes.dialogHeader}
            > 
                {this.props.selectedNode.name} Node Parametreleri
                
            </span>;
        }
        // <FormattedMessage id='dialog.button.ok'/>

        return (
                <div>
                    <Dialog
                        open={this.props.isDialogOpen}
                        onClose={this.handleClose}
                        style={{width:"100%", maxWidth: "none"}}
                        aria-labelledby="scroll-dialog-title"
                    >
                        <DialogTitle
                            id="scroll-dialog-title"
                        >
                            <h3>
                                {dialogTitle}
                            </h3>
                            
                        </DialogTitle>

                        <DialogContent
                            className={classes.dialogContent}
                        >
                            {this.getParameterComponents()}
                        </DialogContent>
                        <DialogActions>
                        <Button
                            onClick={this.handleClose}
                            className={classes.cancelButton}
                        >
                            <FormattedMessage id='dialog.button.cancel'/>
                        </Button>
                        <Button
                            onClick={this.handleOK}
                            className={classes.okButton}
                        >
                            <FormattedMessage id='dialog.button.ok'/>
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
        );

    }

}

export default withStyles(style, {withTheme: true})(NodeParametersDialogComponent);
