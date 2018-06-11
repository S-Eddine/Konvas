import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text , Group, Label, Transformer, KonvaContainerComponent} from 'react-konva';

class Handler extends React.Component {
  componentDidMount() {
    // not really "react-way". But it works.
    const stage = this.transformer.getStage();
    const rectangle = stage.findOne(".test-select");
    this.transformer.attachTo(rectangle);
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class Block extends React.Component {
  rectRef = React.createRef();

  handleDragEnd = () => {
    const rect = this.rectRef.current;
    this.props.onBlockMove(rect.x(), rect.y());
  }
  handleClick = () => {
    //console.log("[TO DO] : handleClick",this.rectRef.current.findOne('Transformer'));
    // if(this.rectRef.current.findOne('Transformer')){
    //   this.rectRef.current.findOne('Transformer').destroy()
    // };
    // var tr = new KonvaContainerComponent.Transformer();
  }
  handleDoubleClick = () => {
    console.log("[TO DO] : handleDoubleClick");
  }
  render() {
    const { x, y, width, height, rotationDeg, color} = this.props;
    let newCoordinates  = calculateAngle(rotationDeg, height, width, x, y);
    return (
      <Group 
        draggable
        onDragEnd={this.handleDragEnd}
        onTransform={this.handleTransform}
        name="test-select" >
        <Rect
          ref={this.rectRef}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          shadowBlur={3}
          rotation={rotationDeg}
          onClick={this.handleClick}
          onDblClick={this.handleDoubleClick} />
        <Label
            x={newCoordinates.x}
            y={newCoordinates.y}
            rotation={newCoordinates.rotationDeg}
            rotation={rotationDeg-90}
            width={width}
            height={height}
            opacity={1} >    
          <Text
            text= "Simple text"
            fontSize={15}
            fontFamily= "Calibri"
            fill="Black" />
        </Label>
      </Group>
    );
  }
}

function calculateAngle(rotationDeg, h, w, x, y){
  var newCoordinates = {};
  switch (rotationDeg) {
    case 0: 
      if(h >= 2*w){
        newCoordinates.rotationDeg = -90;
        newCoordinates.x = x+(w/2.7);
        newCoordinates.y = y+(h-h/2.5);
      }else {
        newCoordinates.rotationDeg = 0;
        newCoordinates.x = x+(w/2.7);
        newCoordinates.y = y+(h-h/2);
      }
      break;
    case 90:
      newCoordinates.rotationDeg = 0;
      newCoordinates.x = x - h/1.5;
      newCoordinates.y = y + w/2.2;
      break;
    case -90:
      newCoordinates.rotationDeg = 0;
      newCoordinates.x = x + h/2.5;
      newCoordinates.y = y - w/1.5;
      break;
    case 45:
      newCoordinates.x=x - h/2.3;
      newCoordinates.y=y + h/2;
      newCoordinates.rotationDeg = -rotationDeg; 
      break;
    case -45:
      newCoordinates.x=x+w;
      newCoordinates.y=y;
      newCoordinates.rotationDeg = -rotationDeg; 
    break;
    default:
    break;
  }
  return newCoordinates;
}

class Blocks extends React.Component {
  state = {
    coordinate: [
        {x: 20, y: 20, color:'#2980B9', width:80,  height:400, rotationDeg:0},
        {x:20,  y:670,  color:'#EBDEF0', width:50, height:300, rotationDeg:90},
        {x:600, y:20,   color:'#1ABC9C', width:60, height:300, rotationDeg:90},
        {x:600, y:200,  color:'#1ABC9C', width:50, height:400, rotationDeg:45},
        {x:600, y:400,  color:'#1ABC9C', width:50, height:240, rotationDeg:-45},
      ] 
  };

  handleBlockMove = (i) => (x, y) => {
    const coor = this.state.coordinate;
    coor[i] = {x ,y, color:coor[i].color , width:coor[i].width,  height:coor[i].height, rotationDeg:coor[i].rotationDeg};
    this.setState({coordinate:coor});
  }
  componentDidMount() {
    // log stage react wrapper
    //console.log(this.refs.stage);
    // log Konva.Stage instance
    //console.log(this.refs.stage.getStage().findOne('Transformer'));
  }

  handleClick = () => {
    console.log("Stage",this.refs.stage.getStage().children[0])
    if(this.refs.stage.getStage().findOne('Transformer')){
      console.log("oui h")
      this.refs.stage.getStage().findOne('Transformer').destroy()
    };
  }

  render() {
    const { coordinate } = this.state;
    return (
      <Stage ref="stage" width={window.innerWidth*2} height={window.innerHeight*2} 
            onClick={() => {this.handleClick()}
            }>
        <Layer>
          { coordinate.map(
              (coor, i) => 
              <Block key={i} x={coor.x} y={coor.y} color={coor.color} width={coor.width} height={coor.height} 
                        rotationDeg={coor.rotationDeg} onBlockMove={this.handleBlockMove(i)}/>
                )
          }
          <Handler />
        </Layer>
      </Stage>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Blocks />
    );
  }
}
render(<App />, document.getElementById('root'));