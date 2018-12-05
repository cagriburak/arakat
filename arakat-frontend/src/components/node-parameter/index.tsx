import {
    Checkbox,
    FormControlLabel,
    TextField,
    Theme,
    withStyles,
    WithStyles,
    Select,
    MenuItem,
    Button,
    FormControl,
    NativeSelect
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import React, { Component } from "react";
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/theme/monokai';
import TemplateSubComponent from '../template-subcomponent';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import classNames from "classnames";



const style: any = (theme: Theme) => ({
    textField: {
        width: '530px',
        marginRight: '43px'
    },
    textFieldShort: {
        width: '380px',
    },
    label: {
        fontSize: '1rem',
        color: 'white',
    },
    select: {
        color: 'white',
    },
    typeSelectContainer: {
        minWidth: 80,
        position: 'absolute',
        top: '23px',
        marginLeft: '21vw',
        marginRight: '50px'
    },
    typeSelect: {
        fontSize: '1rem',
        maxWidth: '150px',
    },
    typeElement: {
        color: 'black',
    },
    object: {
        margin: '20px'
    },
    parameterComponent: {
        marginTop: '5px'
    },
    jsonEditorDiv: {
        marginTop: '25px',
    },
    textFieldLabel: {
        fontSize: '1rem'
    },
    aceEditor: {
        
    }
});

export interface INodeParameterComponentProps {
    parameter: any;
    setValueCallback: (parameter) => void;
}

interface INodeParameterComponentState {
    finalParameterSet: {
        [key: string]: any
    };
    templateSubComponent: any;
    // arrayOfObjectIndex: boolean;
}

type AllTypes = INodeParameterComponentProps & WithStyles< 'textField' | 'label' | 'select' | 'object' |
                                                            'typeSelectContainer' | 'typeSelect' | 'parameterComponent' |
                                                            'typeElement' | 'jsonEditorDiv' | 'typeOption' | 'textFieldLabel' |
                                                            'textFieldShort' | 'aceEditor'>;

/**
 * NodeParameterComponent
 */
class NodeParameterComponent extends Component<AllTypes, INodeParameterComponentState> {
    constructor(props: AllTypes) {
        super(props);        
        this.state = {
            finalParameterSet: {},
            templateSubComponent: {},
            // arrayOfObjectIndex: undefined
        }
    }
    
    public componentWillMount = () => {
        this.setFinalParameterProperties(this.props.parameter, []);                 
    }
    
    public componentWillUnmount = () => {
        if( this.props.parameter.optional && !this.state.finalParameterSet.value ) {
            console.log(this.props.parameter.key + ' is optional and value is empty, hence i keep it to myself.');
        } else {
            this.props.setValueCallback(this.state.finalParameterSet);
        }
    }

    public setFinalParameterProperties = (parameter, parentKeys) => {  
        parameter.key = this.makeTheKeyDifferentIfRepeated(parameter.key);
        const parameterKey = parameter.key;
        let finalParameterSet = {};
        let value = undefined;
        /*
        if( parameter.type_constraint[0] === 'array[object]' ) {
            value = [];
        } 
        */ 

        if( parameter.object_info ) {
            let childParentKeys = [...parentKeys];
            childParentKeys.push(parameterKey);
            const objectParameters = parameter.object_info;
            
            for( const key in objectParameters ) {
                objectParameters[key].key = key;
                this.setFinalParameterProperties(objectParameters[key], childParentKeys);
            }
        }
        if( parameter.default !== undefined) {
            value = parameter.default;
        }
        if( parameter.special_requirements ) {
           finalParameterSet = this.state.finalParameterSet;
           finalParameterSet[parameterKey] = {
                type: parameter.type_constraint[0],
                value,
                special_requirements: parameter.special_requirements,
                parentKeys
           }
        } else {
           finalParameterSet = this.state.finalParameterSet;
           finalParameterSet[parameterKey] = {
                type: parameter.type_constraint[0],
                value,
                parentKeys
           }
        }
        this.setState({
            finalParameterSet
        })
    }

    public makeTheKeyDifferentIfRepeated = (targetKey) => {
        const { finalParameterSet } = this.state;
        for( const key in finalParameterSet ) {
            if( key === targetKey ) {
                targetKey += "*";
            }
        }
        return targetKey;
    }
    public callProperUpdateFunction = (key, type) => (event) => {
        switch( type ) {
            case "number":
                this.updateNumberParameterValue(key, event);
            case "string":
                this.updateStringParameterValue(key, event);
                break;
            case "arrayOfString":
                this.updateArrayOfStringParameterValue(key, event);
                break;
            case "arrayOfInteger":
                this.updateArrayOfIntegerParameterValue(key, event);
                break;
            case "arrayOfFloat":
            case "arrayOfLong":
                this.updateArrayOfFloatParameterValue(key, event);
                break;
        }
    }

    public getComponentForNumberAndString = (parameter, type: string) => {
        const { classes } = this.props;
        const isRequired = parameter.optional ? false : true;
        let isThereTypeSelection = false;
        if (parameter.type_constraint.length > 1) {
            isThereTypeSelection = true;
        }
        const label = 
        <span
            className={classes.textFieldLabel}
        >
            {parameter.visible_name}
        </span>
        return (
            <div
                className={ classes.parameterComponent }          
            >
                <TextField
                    id={parameter.key}
                    onChange={this.callProperUpdateFunction(parameter.key, type)}
                    required={isRequired}
                    label={label}
                    defaultValue={
                        this.state.finalParameterSet[parameter.key].value ?
                        this.state.finalParameterSet[parameter.key].value : ""
                    }
                    className={classNames({
                                [classes.textField]: !isThereTypeSelection,
                                [classes.textFieldShort]: isThereTypeSelection,
                            })}
                />
            </div>
        );
    }

    public getComponentForArrayOfRegex = (parameter) => {
        return <div></div>;
    } 
    
    public getComponentForBoolean = (parameter) => {
        const { classes } = this.props;
        return (
            <div
                className={ classes.parameterComponent }          
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            id={parameter.key}
                            checked={
                                this.state.finalParameterSet[parameter.key].value ?
                                this.state.finalParameterSet[parameter.key].value : false
                            }
                            onChange={this.handleCheckboxChange(parameter.key)}
                        />
                    }
                    label={parameter.visible_name}
                />
            </div>
        );
    }
    public updateStringParameterValue = (key, event) => {
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = event.target.value;
        this.setState({
            finalParameterSet
        });
    }

    public updateArrayOfStringParameterValue = (key, event) => {
        let strArray = event.target.value.split(',');
        strArray = strArray.map((str) => {
            return str.trim();
        })
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = strArray;
        this.setState({
            finalParameterSet
        });
    } 

    public updateSelectParameterValue = (key) => (event) => {
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = event.target.value;
        this.setState({
            finalParameterSet
        });
    }
    public updateNumberParameterValue = (key, event) => {
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = event.target.value;
        this.setState({
            finalParameterSet
        });
    }
    
    public updateArrayOfIntegerParameterValue = (key, event) => {
        let strArray = event.target.value.split(',');
        const numberArray = strArray.map((str) => {
            return parseInt(str.trim());
        })
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = numberArray;
        this.setState({
            finalParameterSet
        });
    } 

    public updateArrayOfFloatParameterValue = (key, event) =>  {
        let strArray = event.target.value.split(',');
        const numberArray = strArray.map((str) => {
            return parseFloat(str.trim());
        })
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = numberArray;
        this.setState({
            finalParameterSet
        });
    }

    public updateCodeParameterValue = (key) => (value) => {
        let finalParameterSet = this.state.finalParameterSet;    
        finalParameterSet[key].value = value;
        this.setState({
            finalParameterSet
        });
    }

    public updateDictValue = (key) => (value) => {
        let finalParameterSet = this.state.finalParameterSet;
        finalParameterSet[key].value = value.jsObject;
        this.setState({
            finalParameterSet
        });
    }
    public handleCheckboxChange = (key) => (event) => {
        let finalParameterSet = this.state.finalParameterSet;        
        finalParameterSet[key].value = event.target.checked;
        this.setState({
            finalParameterSet
        });
    }

    public updateTemplateSubComponentType = (key) => (event) => {
        let templateSubComponent = undefined;

        if( event.target.value === 'array' ) {
            templateSubComponent = {
                value: [],
                type: 'array'
            }
        } else {
            templateSubComponent = {
                value: {},
                type: 'range'
            }
        }   
        this.setState({
            templateSubComponent
        })
       
    }

    public getTemplateSelect = (parameter) => {
        const { classes } = this.props;
        return (
            <Select
                className={ classes.select }
                value={this.state.templateSubComponent.type}
                autoWidth={true}
                onChange={this.updateTemplateSubComponentType(parameter.key)}
            >
                <MenuItem value='array'> liste </MenuItem>
                <MenuItem value='range'> aralık </MenuItem>
            </Select>
        )     
    }

    public updateTemplateSubComponentValue = (subIndex, value, rangeType?) => {
        let finalParameterSet = this.state.finalParameterSet;
        if( rangeType ) {
            finalParameterSet[this.props.parameter.key].value[subIndex].value[rangeType] = 
            parseInt(value);
        } else {
            finalParameterSet[this.props.parameter.key].value[subIndex].value = value;
        }
        this.setState({
            finalParameterSet
        });
    }   
    public addTemplateSubComponent = (key) => {
        let finalParameterSet = this.state.finalParameterSet;   
        finalParameterSet[key].value.push(this.state.templateSubComponent);
        this.setState({
            finalParameterSet
        });
    }

    public getComponentForTemplate = (parameter) => {
        const { classes } = this.props;
        let subIndex = -1;
        let templateSubComponents = [];
        if( this.state.finalParameterSet[parameter.key].value ) { 
            templateSubComponents = this.state.finalParameterSet[parameter.key].value.map((sub) => {
                subIndex++;
                return (
                    <TemplateSubComponent
                        parentKey={parameter.key}
                        type={sub.type}
                        subIndex={subIndex}
                        updateValueCallback={this.updateTemplateSubComponentValue}
                    />
                )
            })
        }
        
        return (
            <div
                className={ classes.parameterComponent }
            >
                { this.getTemplateSelect(parameter) }
                <Button 
                    variant="outlined" 
                    color="primary" 
                    aria-label="Add" 
                    size='small'                    
                    onClick={() => {
                        this.addTemplateSubComponent(parameter.key)
                    }}
                >   
                    <AddIcon />
                </Button>
                { templateSubComponents }
            </div>
        );
    }

    public getComponentForArrayOfTemplate = (parameter) => {
        const { classes } = this.props;
        return (
            <div
                className={ classes.parameterComponent }
            >

            </div>
        );
    }
    // TODO:
    public getComponentForCode = (parameter) => {
        const { classes } = this.props;
        // const isRequired = parameter.optional ? false : true; //TODO: ??
        let value = '\n // UDF Function';
        if( this.state.finalParameterSet[parameter.key].value ) {
            value = this.state.finalParameterSet[parameter.key].value;
        }
        return (
            <div
                className={ classes.parameterComponent }
            >
                <AceEditor
                    mode="python"
                    theme="monokai"
                    value={value}
                    onChange={this.updateCodeParameterValue(parameter.key)}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                    style={{
                        height: "200px",
                        marginTop: '24px',
                        marginBottom: '24px',
                        fontSize: '1rem'
                        
                    }}
                />
            </div>
        );
    }
    public getComponentForObject = (parameter) => {
        const { object_info } = parameter;
        const { classes } = this.props;
        let objectParameters = [];
        for( const key in object_info ) {
            objectParameters.push(this.getParameterComponent(object_info[key])); 
        }
        return (
            <div
                className={ classes.parameterComponent }
            >
                <span
                    className={ classes.label }
                >
                    { parameter.visible_name }
                </span>
                <div
                    className={ classes.object}
                >                
                    { objectParameters }
                </div>
            </div>
            
        );
    }


    public getComponentForDict = (parameter) => {
        const { classes } = this.props;
        const sampleData = {
            parametre_adi: parameter.visible_name
        }
        return (
            <div
                className={ classes.jsonEditorDiv }
            >   
                <JSONInput
                    id          = 'a_unique_id'
                    locale      = { locale }
                    onChange    = { this.updateDictValue(parameter.key)}
                    height      = '350px'
                    width       = '530px'
                    placeholder = {sampleData}
                />
            </div>
        )
    }

    public getComponentForSelect = (parameter) => {
        const { classes } = this.props;
        let menuItems = [];
        parameter.set_constraint.map((item) => {
            menuItems.push(<MenuItem value={item}> { item } </MenuItem>)
        });
        const selectValue = this.state.finalParameterSet[parameter.key].value ?
                            this.state.finalParameterSet[parameter.key].value : "Seçiniz..."
        return (
            <div
                className={ classes.parameterComponent }          
            >
                <span
                    className={ classes.label }
                >
                    { parameter.visible_name }:
                </span>
                <Select
                    className={ classes.select }
                    value={selectValue}
                    autoWidth={true}
                    onChange={this.updateSelectParameterValue(parameter.key)}
                >
                    { menuItems }
                </Select>
            </div>
            
        )
        
    }
    public updateType = (key) => (event) => {
        let finalParameterSet = this.state.finalParameterSet;    
        finalParameterSet[key].type = event.target.value;
        if( event.target.value === 'template' ) {
            finalParameterSet[key].value = [];
        }
        this.setState({
            finalParameterSet
        });
    }

    public getTypeSelectComponent = (parameter) => {
        const { classes } = this.props;
        let types = [];
        parameter.type_constraint.map((item) => {
            types.push( 
                <option 
                    value={ item }
                    className={ classes.typeElement }
                > 
                    { item }
                </option> 
            );
        });
        return (
            <FormControl className={classes.typeSelectContainer}>
                <NativeSelect
                    className={classes.typeSelect}
                    value={this.state.finalParameterSet[parameter.key].type}
                    defaultValue={parameter.type_constraint[0]}
                    name="parameterType"
                    onChange={this.updateType(parameter.key)}
                >                
                    { types }
                </NativeSelect>
            </FormControl>
        )
    }
    public getParameterComponent = (parameter) => {
        const { classes } = this.props; 
        let component = <div/>;
        if ( parameter ) {
            let parameterType = "";
            if( this.state.finalParameterSet[parameter.key].type === "" ) {
                parameterType = parameter.type_constraint[0];
            } else {
                parameterType = this.state.finalParameterSet[parameter.key].type;
            }
            if ( parameter.set_constraint ) {
                component = this.getComponentForSelect(parameter);
            } else {
                switch (parameterType) {
                    case "regex":
                    case "string":
                        component = this.getComponentForNumberAndString(parameter, "string");
                        break;
                    case "integer":
                    case "float":
                    case "long":
                    case "double":
                        component = this.getComponentForNumberAndString(parameter, "number");
                        break;
                    case "array[integer]":
                    case "array[float]":
                    case "array[long]":
                    case "array[double]":
                        component = this.getComponentForNumberAndString(parameter, "arrayOfNumber");
                        break;
                    case "array[regex]":
                        component = this.getComponentForArrayOfRegex(parameter);
                        break;
                    case "array[string]":
                    case "array[array[string]]": // TODO:
                        component = this.getComponentForNumberAndString(parameter, "arrayOfString");
                        break;
                    case "ALL":
                    case "boolean":
                        component = this.getComponentForBoolean(parameter);
                        break;
                    case "template":
                        component = this.getComponentForTemplate(parameter);
                        break;
                    case "array[template]":
                        component = this.getComponentForArrayOfTemplate(parameter);
                        break;
                    case "code":
                        component = this.getComponentForCode(parameter);
                        break;
                    case "object":
                        component = this.getComponentForObject(parameter);
                        break;
                    case "array[object]":
                        // TODO:
                        break;
                    case 'dict':
                        component = this.getComponentForDict(parameter);
                        break;
                    default:
                        component = <p> empty </p>;
                }
            }
            if( parameter.type_constraint.length > 1 ) {
                return (
                    <div 
                        className ={ classes.parameterComponent }
                        style={{
                            position: 'relative'
                        }}
                    >
                        { component }
                        { this.getTypeSelectComponent(parameter) }
                    </div>
                )
            } else {
                return component;
            }
        }
    }
    /**
     * render
     */
    public render(): JSX.Element {
        return ( this.getParameterComponent(this.props.parameter) )
    }
}
export default withStyles(style, {withTheme: true})(NodeParameterComponent);
